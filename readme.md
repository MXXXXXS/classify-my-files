# 想用来整理回忆

## 用来对图片, 视频或一般文件进行分类整理

### 新功能: 增加了进度条 [==========] 100%

分类效果: 以年份作为文件名分成不同文件夹, 每个年份文件夹内, 以月份作为文件名分成不同文件夹, 以存放对应时间的文件

使用方法:

在当前文件夹新建配置文件:**CMFConfig.json**, 填入:

    {
    "source": "",
    "destination": "",
    "deep": true
    }

### *若是windows系统, 请将路径分隔符'\\'全部替换成斜杠'/'*

* 第一项"source"为所需整理的文件夹.
* 第二项"destination"为存放整理文件的, 因为是以复制的形式整理的, 不会改变原文件.
* 第三项"deep"控制是否递归遍历源文件夹的子文件夹. 要遍历子文件夹设为: **true**, 否则设为**false**

然后终端输入

    npm start

***

## Used to classify pictures, videos, or general files

### New feature: progress bar added [==========] 100%

Classification rules: Creating different folders named with year.In each year folder creating different folders named with month, storing the files corresponding to the date.

Usage:

Create a configuration file in the current folder: **CMFConfig.json**, write like this:

    {
    "source": "",
    "destination": "",
    "deep": true
    }

### *On Windows, replace the path separator '\\' all with a slash '/'*

* The first item  "Source" is the folder you want to classify.
* The second item  "Destination" is where to store the classified files. Files are classified by copying, it will not modify the original files.
* The third item "deep" controls if the child folders in source should be traversed. Set it **true** to traverse all child folders, or set it **false**.

Use it in the terminal:

    npm start