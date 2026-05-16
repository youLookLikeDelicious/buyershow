<script setup lang="ts">
import { createUserContent, GoogleGenAI, type ContentListUnion } from '@google/genai';
import { useTemplateRef, ref } from 'vue';
import { JEWELRY_PROMPT, TEA_PROMPT } from './prompts/index';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const isFinished = ref(false);


const promptList: Record<string, string> = {
  'tea': TEA_PROMPT,
  'jewelry': JEWELRY_PROMPT,
}

function base64ToBlob(base64: string): Blob {
  const binaryStr = atob(base64);
  const uint8Array = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    uint8Array[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: "image/png" });
}

// const model = "gemini-3.1-flash-image-preview";
const model = "gemini-3-pro-image-preview";

const img2Scene = async (imgBase64: string|string[], duplicate: number = 3, prompt?: string) => {
  let response

  if (!Array.isArray(imgBase64)) {
    imgBase64 = [imgBase64];
  }

  const content: ContentListUnion = imgBase64.length === 1 ? [
    {
      "text": prompt
    },
    {
      "inlineData": {
        "mimeType": "image/png",
        "data": imgBase64[0]!
      }
    }
  ] : createUserContent([
    prompt!,
    ...imgBase64.map(base64 => ({
      "inlineData": {
        "mimeType": "image/png",
        "data": base64
      }
    }))
  ])
  try {
    response = await ai.models.generateContent({
      model: model,
      contents: content
    })
  } catch (error) {
    console.error("Error generating content:", error);
    return;
  }

  if (!response || !(response.candidates?.length)) {
    console.error("No response received");
    return;
  }

  const now = `${Date.now()}`;
  for (const part of response.candidates?.[0]!.content!.parts ?? []) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data!;
        
        downloadBufferAsFile(base64ToBlob(imageData), `${now}.png`);

        // 再生成两张多角度的图片
        let multiAngleResponse
        for (let i = 0; i < duplicate; i++) {
          try {
            multiAngleResponse = await ai.models.generateContent({
              model: model,
              contents: [
                {
                  "text": `基于这张图片，生成一张同一人物、同一环境、同一手机拍摄风格的不同角度的买家秀图片。`
                },
                {
                  "inlineData": {
                    "mimeType": "image/png",
                    "data": imageData
                  }
                }
              ],
            });
          } catch (error) {
            console.error("Error generating multi-angle content:", error);
            continue;
          }

          if (!multiAngleResponse || !(multiAngleResponse.candidates?.length)) {
            console.error("No response received for multi-angle generation");
            continue;
          }

          for (const multiPart of multiAngleResponse.candidates?.[0]!.content!.parts ?? []) {
            if (multiPart.inlineData) {
              const multiImageData = multiPart.inlineData.data!;
              downloadBufferAsFile(base64ToBlob(multiImageData), `${now}_${i + 1}.png`);
            }
          }
        }
      }
  }
}

function downloadBufferAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const batch = ref(0)
const formRef = useTemplateRef('formRef')

const chunkSize = 1; // 每次处理的图片数量

let files = [] as File[];

const handleSubmit = async () => {
  if (isFinished.value) {
    isFinished.value = false;
  }
  const formData = new FormData(formRef.value!);
  
  if (!files.length) {
    console.error("No file selected");
    return;
  }

  let batchTimes = parseInt(formData.get('batchTimes') as string) || 3;

  let fileBase64 = await fileToBase64(files); 
  fileBase64 = fileBase64.map(item => item.split(',')[1]!); // 取第一张图的base64数据

  let times = parseInt(formData.get('times') as string) || 1;
  
  const project = formData.get('project') as string || 'tea';
  let prompt = promptList[project] || JEWELRY_PROMPT;
  prompt = prompt.replace("{{ prompt }}", formData.get('prompt') as string || "");

  let jobs = []
  for (let i = 0; i < Math.ceil(times / chunkSize); i++) {
    batch.value = i + 1;
    jobs = [];
    const jobTimes = i * chunkSize + chunkSize > times ? times - i * chunkSize : chunkSize;
    for (let j = 0; j < jobTimes; j++) {
      jobs.push(img2Scene(fileBase64, batchTimes - 1, prompt));
    }
    await Promise.all(jobs);
    await sleep(1000);
  }

  isFinished.value = true;
  // files = []
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const fileToBase64 = (files: File[]): Promise<string[]> => {
  
  const result: Promise<string>[] = files.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    })
  });

  return Promise.all(result)
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    files = Array.from(input.files);
  }
};
</script>

<template>
  <h1>Gemini 买家秀生成</h1>
  <p>正在执行批次: {{ batch }}</p>
  <p v-if="isFinished">已完成</p>
  <form action="#" name="form" ref="formRef" @submit.prevent="handleSubmit">
    <div>
      <select name="project">
        <option value="tea">茶叶</option>
        <option value="jewelry">文玩</option>
      </select>
    </div>
    <div>
      <textarea name="prompt" placeholder="请输入提示词" rows="10" cols="50"></textarea>
    </div>
    <div>
      生成: <input type="number" name="times" placeholder="执行次数，默认1" min="1">
    </div>
    <div>
      每组 <input type="number" name="batchTimes" placeholder="每组处理图片数量，默认3" min="1"> 张图片
    </div>
    <div>
      <input type="file" name="file" @change="handleFileChange" multiple>
    </div>
    <button type="submit">Go</button>
  </form>
</template>

<style scoped></style>
