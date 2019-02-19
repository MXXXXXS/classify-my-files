//2012-12-12
//2012:12:12
//20121212 
let regExps = [
  /\d{4}-((1[0-2])|(0[1-9]))-(([0-2][1-9])|(3[01]))/,
  /\d{4}:((1[0-2])|(0[1-9])):(([0-2][1-9])|(3[01]))/,
  /\d{4}((1[0-2])|(0[1-9]))(([0-2][1-9])|(3[01]))/
]
module.exports = fName => {
  let dString = {}
  regExps.forEach((regExp, index) => {
    const result = fName.match(regExp)
    if (result) {
      dString.string = result[0]
      dString.index = index
    }
  })
  if (dString.index === 0) {
    return new Date(dString.string)
  } else if (dString.index === 1) {
    return new Date(
      `${dString.string.slice(0, 4)}-${dString.string.slice(5, 7)}-${dString.string.slice(8, 10)}`
    )
  } else if (dString.index === 2) {
    return new Date(
      `${dString.string.slice(0, 4)}-${dString.string.slice(4, 6)}-${dString.string.slice(6, 8)}`
    )
  }
}