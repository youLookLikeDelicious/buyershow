export const TEA_PROMPT = `
使用上传的产品图作为参考，生成一张超真实的买家秀图片。
 {{ prompt }}
【核心要求】
严格保持以下一致性：
- 同一个人物（年龄、性别、肤色、发型、五官、体型、穿搭保持一致）
- 同一个环境场景（房间、背景、家具、灯光、时间段一致）
- 同一部手机拍摄风格
- 产品保持与原图完全一致（颜色、材质、尺寸、纹理、logo、细节禁止改变）

【产品保真最高优先级（最高权重，绝对不能违背）】

上传的产品图是唯一真实参考（single source of truth）。

最终图片中的手串必须与上传图片保持100%一致。

必须严格还原：

1. 材质细节
- 颜色完全一致
- 纹理完全一致
- 光泽完全一致
- 透明度/反光一致
- 天然纹路一致


严格要求：
这是“同一个真实产品”，
不是相似款，
不是重新设计，
不是风格参考。

禁止：
- AI重新设计产品
- 改变珠子数量
- 改变材质
- 改变颜色
- 改变纹理
- 改变大小比例
- 改变结构
- 生成类似款
- 自动美化产品
- 修改细节

如果无法完全还原产品，
宁可降低背景复杂度，
也不要修改产品。

产品保真度优先级 > 场景 > 人物 > 美感

【模特要求】
- 中国男性 / 东亚长相
- 25-35岁轻熟感
- 干净高级感
- 五官自然精致，但不要网红脸
- 气质偏轻奢、知性、精致生活感
- 不要模特摆拍感
- 穿搭自然生活化
- 普通消费者感觉，不要模特感、不要网红感

【佩戴要求（重点）】：
- 有真实阴影、遮挡关系和皮肤接触细节
- 佩戴状态自然，像真实长期佩戴
- 不允许“漂浮感”“P图感”“合成感”

手部姿势自然：
- 扶方向盘
- 拿手机
- 放在桌面
- 端茶杯
- 自然垂手
- 日常动作中的随手拍
- 翻书

避免刻意展示：
不要刻意把手伸到镜头前摆拍，不要直播间展示感。

【不露脸强约束（重点）】
人物可以出镜，但绝对不要出现人脸：

允许：
- 背影
- 手持展示
- 半身构图
- 肩部以下构图
- 脖子以下裁切
- 手部佩戴/使用展示
- 镜头避开脸部

禁止：
- 出现完整脸部
- 半张脸
- 侧脸
- 五官可见
- 镜子反射出脸
- 玻璃倒影出现脸
- 自拍露脸
- AI生成的人脸

画面风格：
真实消费者拍摄的手机照片，不是广告图，不是专业摄影棚，不要精修感。

场景：

人物佩戴产品，自然真实生活场景，高级感，具有生活痕迹, 例如桌面杂物、家居环境、户外环境、自然光线, 手部细节真实，暖光环境

优先场景：
- 户外自然光
- 高级住宅客厅
- 轻奢办公环境

[场景约束]
必须是中国风格的生活场景，禁止出现明显的西式装修风格，例如欧式家具、地毯、窗帘等。可以是现代简约风格。


人物：
普通消费者气质，不要网红脸，不要模特感。
动作自然，像刚收到商品后顺手拍照分享。
人物与产品互动自然。

镜头语言：
iphone手机拍摄感
轻微构图不完美
自然曝光
不要过度锐化
允许轻微虚焦
允许轻微噪点
有真实阴影和环境光

氛围：
真实、可信、有生活感，让人相信这是用户自发上传的买家反馈图。

避免：
AI感、广告海报、商业摄影、纯白背景、过度美颜、夸张灯光、模特摆拍、假笑、产品变形、手部异常、多余产品。

输出：
高真实性、高转化率电商买家秀。


------------------------------------------------------------------------------------ 

ultra realistic, candid phone shot, authentic customer review photo, natural lighting, imperfect composition, slight motion blur, casual smartphone photography, no studio lighting, no commercial advertisement look
do not redesign bracelet,
do not hallucinate new jewelry,
exact same bracelet from source image,
physically accurate wearing,
correct wrist placement,
realistic bracelet scale,
preserve bracelet geometry,
no floating object,
no deformation,
no fake hand,
no extra fingers
`

export const JEWELRY_PROMPT =  `
使用上传的产品图作为唯一参考（single source of truth），生成一张超真实电商买家秀图片。
{{ prompt }}
# 核心任务

人物正在真实自然地佩戴上传的手串，像普通消费者收到商品后随手拍摄的手机照片。

## 产品保真（最高优先级，绝对不能改变）

上传的产品图是唯一真实参考。

最终画面中的手串必须是**同一个真实手串**，不是相似款、不是风格参考、不是重新设计。

严格保持100%一致：

* 珠子数量完全一致
* 珠径大小一致
* 排列顺序一致
* 穿绳结构一致
* 颜色完全一致
* 材质一致
* 光泽与反光一致
* 天然纹理一致
* 隔珠、吊坠、配件、结扣位置一致
* logo、细节完全一致

绝对禁止：
redesign、similar bracelet、stylized、reinterpretation、auto enhancement、material change、color shift、geometry change、extra beads、missing beads、rearrangement。

如果无法同时满足人物与产品，还原产品优先。

Priority:
bracelet fidelity > physical wearing realism > scene > aesthetics

## 女性人物设定

中国/东亚女性，25–35岁。

白皙皮肤，干净自然，轻熟感，知性高级感。

普通消费者气质，不是模特，不是网红，不要精修感。

穿搭自然生活化：
针织衫、西装外套、轻奢休闲穿搭、日常精致感。

## 不露脸（强约束）

绝对不要出现脸部。

允许：

* 肩部以下构图
* 脖子以下裁切
* 半身避脸
* 背影
* 手部特写
* 持物动作

禁止：

* 正脸
* 半张脸
* 侧脸
* 五官
* 镜子反射脸
* 玻璃倒影脸
* 自拍露脸
* AI脸

camera framing avoids face entirely

## 佩戴真实感（重点强化）

手串真实自然地佩戴在手腕上。

必须：

* 沿手腕弧度自然贴合
* 珠子有真实重力与受力感
* 与皮肤自然接触
* 有合理遮挡关系
* 有自然阴影
* 尺寸比例符合成年人手腕
* 长期佩戴感
* 无悬浮感
* 无贴图感
* 无合成感

bracelet physically wraps around wrist naturally

## 动作（自然随手拍）

随机自然动作：

* 扶方向盘（奔驰 / 宝马 / 特斯拉车内）
* 拿手机
* 放在咖啡桌
* 端咖啡杯
* 翻书
* 打字
* 自然垂手
* 餐厅用餐间隙
* 高铁/飞机座位自然拍摄

不要刻意展示产品。

像用户顺手分享照片，不是卖货拍摄。

## 场景（真实高级生活感 + 户外环境增强）

真实消费者生活场景，具有生活痕迹，像顺手拍摄，不是广告摄影。

场景随机选择一种，自然真实，不要刻意摆拍。

### 室内场景（高级生活感）

* 高级住宅客厅（自然光、沙发、木质家具）
* 精致咖啡馆靠窗位置
* 轻奢办公环境
* 高级餐厅用餐间隙
* 商场停车场
* 豪华车内（Mercedes / BMW / Tesla，自然随拍）
* 高铁 / 飞机座位

### 户外场景（新增）

* 海边散步时自然随拍（柔和自然光、海风感、海岸背景虚化）
* 草坪野餐场景（高级公园草地、野餐垫、咖啡、书本）
* 高级住宅庭院
* 户外咖啡馆露台
* 商场露天区域
* 湖边步道
* 山间轻度徒步休息场景
* 日落时分户外自然光
* 城市街区自然随手拍
* 高级酒店泳池边休闲区域（避免泳装感）

环境要求：

* 自然光优先
* 黄金时段光线（morning light / sunset soft light）
* 真实环境光
* 有生活痕迹
* 轻微背景虚化
* 不要摄影棚感

重要：
场景是辅助，不要抢产品主体。

如果复杂背景影响产品还原，
自动降低背景复杂度，
优先保证手串100%一致。

bracelet fidelity is always more important than environment complexity


## 镜头语言

iphone candid phone shot

真实消费者手机照片：

* slight imperfect composition
* natural exposure
* slight motion blur
* mild image noise
* shallow focus
* authentic smartphone camera feeling
* realistic lighting
* non-commercial

不要：
studio photography,
advertisement poster,
over sharpen,
beauty retouch,
professional product shoot,
perfect symmetry

## 画质目标

Ultra realistic, indistinguishable from a real customer review photo.

Looks like:
真实用户主动上传的小红书/淘宝/拼多多买家秀。

NOT AI GENERATED.

## Negative Prompt

floating bracelet,
incorrect bracelet,
different beads,
wrong material,
extra jewelry,
missing beads,
bracelet redesign,
fake wrist,
deformed hand,
extra fingers,
wrong scale,
bracelet clipping,
CGI,
advertisement photo,
studio lighting,
beauty filter,
perfect composition,
visible face,
mirror reflection face,
AI generated feeling
`