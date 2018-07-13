let fs = require('fs'),
    exPath = 'e:/ACG'
// console.log(inputPath)
let fileRecursion = (fileDir) => {
    let count = -1,
        root = {},
        slash = '/'
    recursion(fileDir, root, count)
    // console.log(JSON.stringify(root, null, 2))
    fs.writeFile('./fileList.json', JSON.stringify(root, null, 2), (e) => {
        e? console.error(e) : console.log('文件已写入完成')
    })
    function recursion(fileDir, tree, n) {
        n++
        let dirList = fs.readdirSync(fileDir)
        if (dirList.length == 0) return console.log('+'.repeat(n) + '"' + fileDir + '"' + ' is a blank folder')
        dirList.forEach((item) => {
            let isDir = fs.statSync(fileDir + slash + item).isDirectory(),
                isFile = fs.statSync(fileDir + slash + item).isFile()
            isDir && !isFile ? whenIsDir(item, tree) : whenIsFile(item, tree)
        })
        function whenIsDir(inItem, inTree) {
            inTree[inItem] = {}
            console.log('+'.repeat(n) + inItem + ' :')
            recursion(fileDir + slash + inItem, inTree[inItem], n)
        }
        function whenIsFile(inItem, inTree) {
            inTree[inItem] = fileDir + slash + inItem
            return console.log('+'.repeat(n) + inItem)
        }
    }
}
fileRecursion(exPath)

