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


// console.log(collectFiles('D:/UW/图片/中世纪的欧洲建筑图赏 _都铎风格'))
module.exports = collectFiles