# 照片整理工具

## 用来按时间整理照片

整理效果:

如有一张日期为2019:09:13的照片, 目标文件夹为当前目录, 这张照片会被复制并存放到"./2019/9/13"文件夹下

使用方法:

    npx cmf -S <path> -D <path>

选项:

    -S, --source <path>                 source folder
    -D, --destination <path>            destination folder
    -m, --mode <link | copy | symlink>  create symlinks, links or copies of source files (default: "link")
    -d, --deep <true | false>           whether or not traverse source folder recursively (default: true)
    -h, --help                          output usage information

### *在window系统上, "mode: symlink"需要管理员权限或运行在"开发者模式"下*
