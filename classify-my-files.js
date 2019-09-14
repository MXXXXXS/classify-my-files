#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const program = require(`commander`)
const progressBar = require(`progress`)
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const ep = new exiftool.ExiftoolProcess(exiftoolBin)

const { saveTo, parseDateFrom, earliest, traverseFiles } = require(`./utils`)

program
  .option(`-S, --source <path>`, `source folder`)
  .option(`-D, --destination <path>`, `destination folder`)
  .option(`-m, --mode <link | copy | symlink>`, `create symlinks, links or copies of source files`, `link`)
  .option(`-d, --deep <true | false>`, `whether or not traverse source folder recursively`, true)

program.parse(process.argv)

if (program.source && program.destination) {
  trigger({
    source: path.resolve(program.source),
    destination: path.resolve(program.destination),
    mode: program.mode,
    deep: program.deep
  })
}

async function trigger(config) {
  let counter = 0
  await ep.open()
  traverseFiles(config.source, async (p, stats) => {
    ++counter
    const dates = []
    const info = await ep.readMetadata(p, ['ModifyDate', 'CreateDate', 'DateCreated', 'charset filename=utf8'])

    //date from file stats
    dates.push(stats.mtime)

    //date from exif
    if (info) {
      const item = info.data[0]
      let time
      if (item['ModifyDate']) {
        time = parseDateFrom(item.ModifyDate.slice(0, 10))
      } else if (item['CreateDate']) {
        time = parseDateFrom(item.CreateDate.slice(0, 10))
      } else if (item['DateCreated']) {
        time = parseDateFrom(item.DateCreated.slice(0, 10))
      }
      if (time) dates.push(time)
    }

    //date from file name
    const time = parseDateFrom(path.basename(p))
    if (time) dates.push(time)

    const earliestDate = earliest(...dates)
    const savePosition = path.resolve(
      config.destination,
      String(earliestDate.getFullYear()),
      String(earliestDate.getMonth() + 1),
      path.basename(p))

    //save file copy or link to destination
    saveTo(config.mode, p, savePosition)
    .then((err) => {
      --counter
      if (counter === 0) ep.close()
    })
    .catch(err => {
      console.error(err)
      --counter
      if (counter === 0) ep.close()
    })
  }, config.deep)
}