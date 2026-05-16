import argparse
import os
import shutil
import re

def find_txt_file(path: str):
    for name in os.listdir(path):
        if name.lower().endswith('.txt'):
            return os.path.join(path, name)
    return None

def get_image_bases(path: str, exts=None):
    if exts is None:
        exts = {'png', 'jpg', 'jpeg', 'gif'}
    bases = []
    for name in sorted(os.listdir(path)):
        lower = name.lower()
        if any(lower.endswith('.' + e) for e in exts):
            base = name.split('.')[0].split('_')[0]
            if base not in bases:
                bases.append(base)
    return bases

def group_comments(path: str, move: bool = False, outdir: str = 'groups'):
    txt_path = find_txt_file(path)
    if not txt_path:
        print('未找到 txt 文件，取消操作。')
        return

    with open(txt_path, 'r', encoding='utf-8') as f:
        comments = [line.rstrip('\n') for line in f]

    bases = get_image_bases(path)
    count = min(len(comments), len(bases))
    if len(comments) != len(bases):
        print(f'警告：评论数({len(comments)}) 与 图片组数({len(bases)}) 不一致，将按最小值({count})配对。')

    out_root = os.path.join(path, outdir)
    os.makedirs(out_root, exist_ok=True)

    exts = ('png', 'jpg', 'jpeg', 'gif')
    for i in range(count):
        base = bases[i]
        folder_name = f"{i+1:03d}_{base}"
        dst_folder = os.path.join(out_root, folder_name)
        os.makedirs(dst_folder, exist_ok=True)

        # 写入评论文本
        with open(os.path.join(dst_folder, 'comment.txt'), 'w', encoding='utf-8') as cf:
            comment = re.sub(r'^\d+\.+', '', comments[i]).strip()
            cf.write(comment)

        # 复制或移动对应的图片
        for name in os.listdir(path):
            lower = name.lower()
            if any(lower.endswith('.' + e) for e in exts):
                if name.split('.')[0].split('_')[0] == base:
                    src = os.path.join(path, name)
                    dst = os.path.join(dst_folder, name)
                    if move:
                        shutil.move(src, dst)
                    else:
                        shutil.copy2(src, dst)

    print(f'已生成 {count} 个分组，输出目录：{out_root}')


def main(path: str, move: bool = False):
    if not path:
        print('请使用 -p 指定文件夹路径')
        return
    if not os.path.isdir(path):
        print(f'路径不存在或不是文件夹：{path}')
        return
    group_comments(path, move=move)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="输入文件夹路径, 进行分组打包.")
    parser.add_argument("-p", "--path", type=str, help="输入文件夹路径 D:/download/images.")
    parser.add_argument("--move", action='store_true', help="启用则移动文件（默认复制）。")
    args = parser.parse_args()
    main(args.path, args.move)