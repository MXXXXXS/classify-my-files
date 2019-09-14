const fs = require('fs')
const path = require('path')

function traverseFiles(dir, cbForEachFile, deep = true) {
  traverse(dir, deep)
  function traverse(dir, deep) {
    fs.readdir(dir, (err, files) => {
      if (err) throw err
      files.forEach(item => {
        const p = path.resolve(dir, item)
        fs.stat(p, (err, stats) => {
          if (err) throw err
          if (stats.isDirectory() && deep) {
            traverse(p)
          } else {
            cbForEachFile(p, stats)
          }
        })
      })
    })
  }
}

function earliest(...dates) {
  return new Date(Math.min(...dates))
}

function saveTo(mode = `copy`, src, dest) {
  return new Promise((res, rej) => {
    dest = path.resolve(dest)
    const parts = dest.split(path.sep)
    parts.slice(0, parts.length - 1).reduce((acc, cur, i) => {
      if (i !== 0)
        acc = acc + path.sep + cur
      if (!fs.existsSync(acc)) {
        fs.mkdirSync(acc)
      }
      return acc
    })
    switch (mode) {
      case `copy`: {
        const source = fs.createReadStream(src)
        const destination = fs.createWriteStream(dest)
        source.pipe(destination)
        destination.on(`finish`, () => {
          destination.removeAllListeners(`finish`)
          res()
        })
        destination.on(`error`, (err) => {
          destination.removeAllListeners(`error`)
          rej(err)
        })
        source.on(`error`, (err) => {
          source.removeAllListeners(`error`)
          rej(err)
        })
      }
        break
      case `link`: {
        fs.link(src, dest, (err) => {
          if (err) rej(err)
          res(err)
        })
      }
        break
      case `symlink`: {
        fs.symlink(src, dest, (err) => {
          if (err) rej(err)
          res(err)
        })
      }
    }
  })
}


function parseDateFrom(timeString) {
  //2012-12-12
  //2012:12:12
  //20121212
  const timeStringRegs = [
    /(?<!\d)\d{4}-((1[0-2])|(0[1-9]))-((0[1-9])|([12][0-9])|(3[01]))(?!\d)/,
    /(?<!\d)\d{4}:((1[0-2])|(0[1-9])):((0[1-9])|([12][0-9])|(3[01]))(?!\d)/,
    /(?<!\d)\d{4}((1[0-2])|(0[1-9]))((0[1-9])|([12][0-9])|(3[01]))(?!\d)/
  ]
  const matched = {}
  let dateBuffer
  timeStringRegs.forEach((reg, index) => {
    const result = timeString.match(reg)
    if (result) {
      matched.string = result[0]
      matched.index = index
    }
  })
  switch (matched.index) {
    case 0: {
      dateBuffer = matched.string
    }
      break
    case 1: {
      dateBuffer = matched.string.replace(/:/g, '-')
    }
      break
    case 2: {
      dateBuffer = `${matched.string.slice(0, 4)}-${matched.string.slice(4, 6)}-${matched.string.slice(6, 8)}`
    }
      break
  }
  if (dateBuffer) {
    const year = parseInt(dateBuffer.slice(0, 4))
    const month = parseInt(dateBuffer.slice(5, 7))
    const day = parseInt(dateBuffer.slice(-2))
    if (month === 2 && day === 29 && !isLeapYear(year)) {
      return
    } else {
      return new Date(dateBuffer)
    }
  }
  function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) ||
      (year % 400 === 0 && year % 3200 !== 0))
      return true
    return false
  }
}

module.exports = { traverseFiles, parseDateFrom, saveTo, earliest }