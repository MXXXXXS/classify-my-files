const fs = require('fs'),
    fsPromises = require('fs').promises,
    exif = require('./get-exif.js'),
    fr = require('./file-recursion.js'),
    path = require('path')
//转换exif时间为Date对象
const { parse } = require('exif-date')
//读取配置文件
let Config = fs.readFileSync('./CMFConfig.json', 'utf8')
if (!Config) throw 'read CMFConfig.json failed!'
let CMFConfig = JSON.parse(Config),
    { source, destination, regex } = CMFConfig

let openedEP = exif.openExif(),//启动exiftool
    fArr = fr.getFilesArr(source),//获得文件列表
    pArr = []//存放fArr.forEach产生的promise

fArr.forEach(fPath => {
    pArr.push(
        Promise
            .all([
                exif.getDate(openedEP, fPath, (metadata) => {
                    if (metadata.data[0].CreateDate) return parse(metadata.data[0].CreateDate)
                }),
                // new Promise(function (res, rej) {
                //     //正则分析文件名蕴含的日期
                // }),
                fsPromises
                    .stat(fPath)
                    .then(stats => {
                        return new Date(
                            Math.min(...[
                                stats.birthtime.valueOf(),
                                stats.mtime.valueOf(),
                                stats.ctime.valueOf()
                            ])
                        )
                    })
            ])//三组日期选出最早的日期
            .then((dArr) => {
                console.log(dArr)
                if (!dArr[0]) dArr.shift()
                // if(!(dArr[0] instanceof Date)) dArr.shift()
                return { fname: fPath, fdate: new Date((Math.min(...dArr.valueOf()))) }
            })
            .catch(console.error)
    )
})

Promise
    .all(pArr)
    .then((fcooked) => {
        exif.closeExif(openedEP)//关闭exiftool
        console.log('files info read finished!\nnow start classifying...')
        console.log(JSON.stringify(fcooked, null, 2))
        fcooked.forEach(file => {
            let dest = `${file.fdate.getFullYear()}`,
                indest = `${file.fdate.getMonth() + 1}`
            fsPromises
                .mkdir(`${destination}/${dest}`)
                .catch(() => undefined)
                .finally(() => {
                    fsPromises
                        .mkdir(`${destination}/${dest}/${indest}`)
                        .catch(() => undefined)
                        .finally(() => {
                            fsPromises
                                .copyFile(file.fname, `${destination}/${dest}/${indest}/${path.basename(file.fname)}`)
                                .catch(console.error)
                        })
                })
        })
    }, console.error)
    .catch(console.error)
