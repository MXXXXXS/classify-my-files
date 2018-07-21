#! /usr/bin/env node
const fs = require('fs'),
    fsPromises = require('fs').promises,
    exif = require('./get-exif.js'),
    fr = require('./file-recursion.js'),
    path = require('path')
//转换exif时间为Date对象
const { parse } = require('exif-date')
//读取配置文件
const Config = fs.readFileSync('./CMFConfig.json', 'utf8')
if (!Config) throw 'Reading "CMFConfig.json" failed!\nMaybe there\'s no CMFConfig.json\nPlease create one'
const { source, destination } = JSON.parse(Config)
pArr = []//存放fArr.forEach产生的promise
fArr = fr.getFilesArr(source)//获得文件列表
console.log('The list of files\'names has been created!\nStart getting each file\'s date...')
exif
    .openExif()//启动exiftool
    .then(() => {
        fArr.forEach(file => {
            pArr.push(//将一堆Promise装入数组, 以备后用
                Promise
                    .all([//三组日期选出最早的日期
                        exif
                            .getDate(file)
                            .then((metadata) => {
                                return metadata.data[0].CreateDate ? parse(metadata.data[0].CreateDate) : undefined
                            })
                            .catch(() => undefined),//正则分析文件名蕴含的日期
                        Promise
                            .resolve()
                            .then(() => {
                                let regex = new RegExp(/(\d{4})-([01]\d)-([0123]\d)|(\d{4})([01]\d)([0123]\d)/),//支持类似: 2018-07-21, 20180721
                                    arr = path.basename(file).match(regex)
                                if (arr) {
                                    let s = new Set(arr)
                                    s.delete(undefined)
                                    let a = [...s]
                                    a.shift()
                                    return new Date(a[0], a[1] - 1, a[2]) ? new Date(a[0], a[1] - 1, a[2]) : undefined
                                }
                            })
                            .catch(() => undefined),
                        fsPromises
                            .stat(file)
                            .then(stats => {
                                return new Date(
                                    Math.min(...[
                                        stats.birthtime.valueOf(),
                                        stats.mtime.valueOf(),
                                        stats.ctime.valueOf()
                                    ])
                                )
                            })
                            .catch(() => undefined)
                    ])
                    .then((dArr) => {
                        let s = new Set(dArr)
                        s.delete(undefined)
                        s.delete(NaN)
                        let a = [...s]
                        if (a.length != 0) return { fname: file, fdate: new Date((Math.min(...a.valueOf()))) }//fcooked
                    })
                    .catch(console.error)
            )
        })
    })
    .then(() => {
        Promise
            .all(pArr)
            .then((fcooked) => {
                exif
                    .closeExif()//关闭exiftool
                    .then(() => {
                        console.log('All dates read finished\nNow start copying and classifying...\nPlease wait❤')
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
                    })
                    .catch(console.error)
            })
            .catch(console.error)
    })