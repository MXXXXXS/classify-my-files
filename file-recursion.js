const fs = require('fs')
let fileArray = (fileDir) => {
    let root = {},
        slash = '/',
        arr = []
    recursion(fileDir, root)
    function recursion(fileDir, tree) {
        let dirList = fs.readdirSync(fileDir)
        if (dirList.length == 0) return 
        dirList.forEach((item) => {
            let isDir = fs.statSync(fileDir + slash + item).isDirectory(),
                isFile = fs.statSync(fileDir + slash + item).isFile()
            isDir && !isFile ? whenIsDir(item, tree) : whenIsFile(item, tree)
        })
        function whenIsDir(inItem, inTree) {
            inTree[inItem] = {}
            recursion(fileDir + slash + inItem, inTree[inItem])
        }
        function whenIsFile(inItem, inTree) {
            arr.push(fileDir + slash + inItem)
            inTree[inItem] = fileDir + slash + inItem
        }
    }
    return arr
}
exports.getFilesArr = fileArray