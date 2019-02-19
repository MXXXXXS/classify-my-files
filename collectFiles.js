const fs = require('fs')
const path = require('path')
let collectFiles = dir => {
  let filesCollection = {}
  recursion(dir)

  function recursion(dir, deep = true) {
    let files = fs.readdirSync(dir)
    files.forEach(item => {
      let isDir = fs.statSync(path.resolve(dir, item)).isDirectory()
      if (isDir && deep) {
        recursion(path.resolve(dir, item))
      } else if (!isDir) {
        let mtimeMs = fs.statSync(path.resolve(dir, item)).mtimeMs
        let birthtimeMs = fs.statSync(path.resolve(dir, item)).birthtimeMs
        filesCollection[path.resolve(dir, item)] = Math.min(mtimeMs, birthtimeMs)
      }
    })
  }
  return filesCollection
}

module.exports = collectFiles