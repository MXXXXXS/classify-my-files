//通用模块加载
let fs = require('fs'),
    path = require('path')
//读取配置文件
let Config = fs.readFileSync('./CMFConfig.json', 'utf8')
if (!Config) throw 'read CMFConfig.json failed!'
let CMFConfig = JSON.parse(Config),
    { source, destination, ffpath } = CMFConfig
//初始化fluent-ffmpeg
let ffmpeg = require('fluent-ffmpeg'),
    command = ffmpeg()
command.setFfmpegPath(ffpath + '/ffmpeg.exe')
command.setFfprobePath(ffpath + '/ffprobe.exe')
// 初始化exif
let ExifImage = require('exif').ExifImage

//处理视频
function getVideoMeta(video) {
    ffmpeg.ffprobe(video, function (err, metadata) {
        if (err)
            throw 'ffprobe fn err:\n' + err
        handleVMeta(metadata)
    })
}
function handleVMeta(meta) {
    fs.writeFile(destination + '/meta.json', JSON.stringify(meta, null, 2), (err) => {
        if (err)
            throw 'ffprobe fn writeFile err:\n' + err
    })

}
// getVideoMeta('D:/UW/视频/手机视频存储/2018_3_3/IMG_20170628_205702.jpg')

//处理图片
function getImgMeta(img) {
    try {
        new ExifImage({image : img}, function (e, exifData) {
            if (e) {
                throw e
            }
            return exifData
        })
    } catch (error) {
        throw error
    }
}
let exifData = getImgMeta('D:/UW/图片/晚/IMG_20160829_184138.jpg')
console.log(JSON.stringify(exifData, null, 2))
//TODO:遍历目录, 解决文件名的问题
