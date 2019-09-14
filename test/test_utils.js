const chai = require(`chai`)
const assert = chai.assert
const {
  saveTo,
  earliest,
  parseDateFrom
} = require(`../utils`)
const fs = require(`fs`)

describe(`#saveTo()`, function () {
  const modes = [`copy`, `link`, `symlink`]
  const src = `${__dirname}/assets/from/testFile.txt`
  const dest = `${__dirname}/assets/to/laryer0/laryer1/testFile.txt`
  it(`写入文件到路径:${dest}`, async function () {
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const err = await saveTo(mode, src, dest).catch(err => console.error(err))
      assert.notExists(err, `"saveTo"错误: ${err}`)
      assert.equal(fs.existsSync(dest), true, `"saveTo"写入文件不存在`)
      fs.unlinkSync(dest)
    }
    fs.rmdirSync(`${__dirname}/assets/to/laryer0/laryer1`)
    fs.rmdirSync(`${__dirname}/assets/to/laryer0`)
  })
})

describe(`#earliest()`, function () {
  it(`最早的日期:`, function () {
    const dates = [new Date(2019, 9), new Date(2019, 3), new Date(2019, 12)]
    assert.equal(earliest(...dates).toString(), dates[1].toString(), `"earliest"没有返回最早的日期`)
  })
})

describe(`#parseDateFrom()`, function () {
  it(`从字符串解析日期:`, function () {
    const dateStrs = [
      `addfa2077-3-2dsaf`,
      `dfjoi2004:03:23kj`,
      `20770308`,
      `1900-02-29`
    ]
    assert.isUndefined(parseDateFrom(dateStrs[0]))
    assert.typeOf(parseDateFrom(dateStrs[1]), `date`)
    assert.typeOf(parseDateFrom(dateStrs[2]), `date`)
    assert.isUndefined(parseDateFrom(dateStrs[3]), `不是闰年, 应该返回"undefinded"`)
  })
})