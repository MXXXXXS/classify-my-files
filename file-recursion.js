const fs = require('fs')
let fileRecursion = (fileDir, cb) => {
    let root = {},
        slash = '/'
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
            cb(fileDir + slash + inItem)
            inTree[inItem] = fileDir + slash + inItem
        }
    }
}
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

function saveTo(srcPath, savePath) {
    let fileRecursion = (fileDir) => {
        let root = {},
            slash = '/'
        recursion(fileDir, root)
        return root
        function recursion(fileDir, tree) {
            let dirList = fs.readdirSync(fileDir)
            if (dirList.length == 0) return console.log('"' + fileDir + '"' + ' is a blank folder')
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
                inTree[inItem] = fileDir + slash + inItem
            }
        }
    }
    let str = fileRecursion(srcPath)
    fs.writeFile(savePath, JSON.stringify(str, null, 2), (e) => {
        e ? console.error(e) : console.log('文件已写入完成');
    })
}

function list(fileDir) {
    let fileRecursion = (fileDir) => {
        let count = -1,
            root = {},
            slash = '/'
        recursion(fileDir, root, count)
        function recursion(fileDir, tree, n) {
            n++
            let dirList = fs.readdirSync(fileDir)
            if (dirList.length == 0) return
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
                console.log('+'.repeat(n) + inItem)
            }
        }
    }
    fileRecursion(fileDir)
}
exports.getFilesArr = fileArray
exports.forEachFile = fileRecursion
exports.list = list
exports.saveTo = saveTo
// fileRecursion('D:/coding/pra-file/forTest', (item) => {
//     console.log(item)
// })
// list('D:/coding/pra-file/forTest')
// saveTo('D:/coding/pra-file/forTest', 'D:/coding/pra-file/saveTo.json')