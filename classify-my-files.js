#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const ep = new exiftool.ExiftoolProcess(exiftoolBin)
const ProgressBar = require('progress')

const tryParseDate = require('./tryToParseDateFromString.js')
const collectFiles = require('./collectFiles.js')

const CMFconfig = path.resolve(__dirname, '../../CMFconfig.json')

let config

function readFile(file) {
  return new Promise((res, rej) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) rej(err)
      res(data)
    })
  }).catch(err => console.error(`× Failed to read file: ${file}\n  Error: ${err}`))
}

async function trigger() {
  config = await readFile(CMFconfig).catch(() => console.error('x Cannot find CMFconfig.json'))
    .then(data => {
      return JSON.parse(data)
    })
  if (config) {
    if (fs.existsSync(config.source) &&
      fs.existsSync(config.destination) &&
      typeof config.deep === 'boolean') {
      console.log('√ Configuration loaded')
      console.log('√ Start collecting files')
      let files = collectFiles(config.source, config.deep)
      console.log('√ Files collected')
      console.time('Time used: ')
      exif(files)
    } else {
      console.error(`x Something wrong with your config, please cheack it.
        It should be like this:
        {
          "source": "[Full path]",  //The full path of the source dir you want to classify.
          "destination": "[Full path]",  //The full path of the destination dir where you want to store the classified files. If the dir didn't exit, please create one.
          "deep": [boolean]  //If you want to classify the dir recursively, set it: true, or set it: false.
      }`)
    }
  }
}

async function exif(files) {
  await ep.open().then(() => {
    console.log('√ Exiftool opened')
  }).catch(() => {
    throw '× Exiftool start failed'
  })
  let mfiles = await earliest(files).catch(err => console.error(err))
  await ep.close()
    .then(() => {
      console.log('√ Exiftool closed')
    })
    .catch(err => {
      console.error(err)
    })

  classify(mfiles, config.destination)
  console.timeEnd('Time used: ')

  function classify(files, dest) {
    const bar = new ProgressBar('Classifying the files [:bar] :percent :etas', {
      total: Object.keys(files).length,
      width: 40
    })
    for (const file in files) {
      if (files.hasOwnProperty(file)) {
        const ms = files[file];
        let date = new Date(ms)
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        if (!fs.existsSync(path.resolve(dest, year.toString()))) {
          fs.mkdirSync(path.resolve(dest, year.toString()))
        } else if (!fs.statSync(path.resolve(dest, year.toString())).isDirectory()) {
          fs.mkdirSync(path.resolve(dest, year.toString()))
        }
        if (!fs.existsSync(path.resolve(dest, year.toString(), month.toString()))) {
          fs.mkdirSync(path.resolve(dest, year.toString(), month.toString()))
        } else if (!fs.statSync(path.resolve(dest, year.toString(), month.toString())).isDirectory()) {
          fs.mkdirSync(path.resolve(dest, year.toString(), month.toString()))
        }
        fs.copyFileSync(file, path.resolve(dest, year.toString(), month.toString(), path.basename(file)))
        bar.tick()
      }
    }
  }

  async function readMetadata(file, option) {
    return ep.readMetadata(file, option).catch(() => {
      console.error(`x Failed to read meta data from: ${file}`)
    })
  }

  async function earliest(files) {
    const bar = new ProgressBar('Parsing the earliest date [:bar] :percent :etas', {
      total: Object.keys(files).length,
      width: 40
    })
    for (const file in files) {
      bar.tick()
      if (files.hasOwnProperty(file)) {
        let info = await readMetadata(file, ['ModifyDate', 'CreateDate', 'DateCreated', 'charset filename=utf8'])
        if (info) {
          let item = info.data[0]
          let mtimes = []
          let ftime = tryParseDate(path.basename(file))
          if (item.hasOwnProperty('ModifyDate')) {
            let time = tryParseDate(item.ModifyDate.slice(0, 10))
            if (time) mtimes.push(time.getTime())
          }
          if (item.hasOwnProperty('CreateDate')) {
            let time = tryParseDate(item.CreateDate.slice(0, 10))
            if (time) mtimes.push(time.getTime())
          }
          if (item.hasOwnProperty('DateCreated')) {
            let time = tryParseDate(item.DateCreated.slice(0, 10))
            if (time) mtimes.push(time.getTime())
          }
          if (mtimes.length != 0) {
            if (ftime) {
              files[path.normalize(item.SourceFile)] = Math.min(files[path.normalize(item.SourceFile)], ftime, ...mtimes)
            } else {
              files[path.normalize(item.SourceFile)] = Math.min(files[path.normalize(item.SourceFile)], ...mtimes)
            }
          } else if (ftime) {
              files[path.normalize(item.SourceFile)] = Math.min(files[path.normalize(item.SourceFile)], ftime)
          }
        }
        let ftime = tryParseDate(path.basename(file))
        if (ftime) {
          files[file] = Math.min(files[file], ftime)
        }
      }
    }
    return files
  }
}

trigger()
