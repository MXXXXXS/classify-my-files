####用来对图片, 视频或一般文件进行分类整理

#####需要node v10环境

分类效果: 以年份作为文件名分成不同文件夹, 每个年份文件夹内, 以月份作为文件名分成不同文件夹, 以存放对应时间的文件

使用方法:

在当前文件夹新建配置文件:**CMFConfig.json**, 填入:

    {
    "source": "",
    "destination": ""
    }

填入原文件夹, 目标文件夹路径

**若是windows系统, 请将路径分隔符'\\'全部替换成斜杠'/'**

* 第一项"source"为所需整理的文件夹
* 第二项"destination"为整理的目标文件夹, 因为是以复制的形式整理的, 不会改变原文件

然后终端输入

    npx cmf

等待程序复制整理完成, 目前尚没有进度条功能, 请耐心等待❤

######细节仍在改进中...

####Used to classify pictures, videos, or general files

#####Node V10 environment required

Classification result: Creating different folders which named with year.In each folder creating different folders which named with month, containing the files corresponding to the date.

Usage:

Create a new configuration file in the current folder: **CMFConfig.json**, copy this into the json file:

    {
    "source": "",
    "destination": ""
    }

Fill in the path of the "source folder" and "destination folder"

**If you are a Windows system, replace the path separator '\\' all with a slash '/'**

* The first item  "Source" is the folder you want to classify
* The second item  "Destination" is the target folder to store the classified files. Because files are classified by copying, it will not modify the original files

Then use it in the terminal:

    npx cmf

Wait for the program to copy and finish, there is no progress bar yet, please be patient❤

#####Details are still being improved...
