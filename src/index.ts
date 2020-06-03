const getNativeType = (obj: any): string => Object.prototype.toString.call(obj)

// 类型
type ICatchItem = { original: any, copy: any }
type ICircleLink = { target: any, key: any, catchItem: ICatchItem }
type likeType = ArrayBuffer | Blob | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | BigInt64Array | BigUint64Array

// 判断
const isObjectString = (obj: any) => getNativeType(obj) === '[object String]' && typeof obj === 'object' && obj.charAt
const isObjectNumber = (obj: any) => getNativeType(obj) === '[object Number]' && typeof obj === 'object'
const isMap = (obj: any): boolean => getNativeType(obj) === '[object Map]'
const isSet = (obj: any): boolean => getNativeType(obj) === '[object Set]'
const isObject = (obj: any): boolean => getNativeType(obj) === '[object Object]'
const isFunction = (obj: any): boolean => getNativeType(obj) === '[object Function]'
const isRegExp = (obj: any): boolean => getNativeType(obj) === '[object RegExp]'
const isDate = (obj: any): boolean => getNativeType(obj) === '[object Date]'
const isDataView = (obj: any): boolean => getNativeType(obj) === '[object DataView]'
const isArray = (obj: any): boolean => Array.isArray(obj)
const isBufferOrBlobOr_Big__Int__Uint__Clamped_Array = (obj: any): boolean => /^\[object (((Big)?(Int|Uint)\d+)?(Clamped)?Array(Buffer)?|Blob)\]$/.test(getNativeType(obj))

// 复制
const copyObjectString = (strObj: any): String => new String(strObj)
const copyObjectNumber = (numObj: any): Number => new Number(numObj)
const copyDate = (date: any): Date => new Date(date)
const copySet = (set: any): Set<any> => new Set(set)
const copyMap = (map: any): Map<any, any> => new Map(map)
const copyReg = (reg: any): RegExp => new RegExp(reg)
const copyFunction = (fn: any): Function => new Function('return ' + fn.toString())()
const copyDataView = (view: any): DataView => new DataView(view.buffer.slice(0), view.byteOffset, view.byteLength)
const copyBufferOrBlobOr_Big__Int__Uint__Clamped_Array = (arrLike: likeType & any) => arrLike.slice(0)
const deepCopyArray = (arr: any): any[] => {
  const newArr: any[] = []
  arr.forEach((item: any, index: number) => {
    newArr.push(deepCopy(item, newArr, index))
  })
  return newArr
}
const deepCopyObject = (obj: any) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj)
  const res: any = {}
  const keys = Object.keys(descriptors)
  keys.forEach((key) => {
    const descriptor = descriptors[key]
    if (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable) {
      Object.defineProperty(res, key, Object.assign({}, descriptor, { value: deepCopy(descriptor.value, res, key) }))
    } else {
      res[key] = deepCopy(obj[key], res, key)
    }
  })
  const symbols = Object.getOwnPropertySymbols(obj)
  symbols.forEach((symbol, i) => {
    res[symbol] = deepCopy(obj[symbol], res, symbol)
  })
  return res
}

// core
let cacheList: ICatchItem[] = []
let circleLinks: ICircleLink[] = []
const deepCopy = <T extends any>(obj: T, target?: any, key?: any): T => {
  let catchItem: ICatchItem = {
    original: obj,
    copy: void 0
  }
  const hit = cacheList.find(c => c.original === obj)
  if (hit) {
    catchItem = hit
    circleLinks.push({
      target,
      key,
      catchItem,
    })
    return hit.copy
  } else {
    cacheList.push(catchItem)
    if (isObjectString(obj)) {
      catchItem.copy = copyObjectString(obj)
    } else if (isObjectNumber(obj)) {
      catchItem.copy = copyObjectNumber(obj)
    } else if (isSet(obj)) {
      catchItem.copy = copySet(obj)
    } else if (isMap(obj)) {
      catchItem.copy = copyMap(obj)
    } else if (isFunction(obj)) {
      catchItem.copy = copyFunction(obj)
    } else if (isObject(obj)) {
      catchItem.copy = deepCopyObject(obj)
    } else if (isArray(obj)) {
      catchItem.copy = deepCopyArray(obj)
    } else if (isRegExp(obj)) {
      catchItem.copy = copyReg(obj)
    } else if (isDate(obj)) {
      catchItem.copy = copyDate(obj)
    } else if (isDataView(obj)) {
      catchItem.copy = copyDataView(obj)
    } else if (isBufferOrBlobOr_Big__Int__Uint__Clamped_Array(obj)) {
      catchItem.copy = copyBufferOrBlobOr_Big__Int__Uint__Clamped_Array(obj)
    } else {
      catchItem.copy = obj
    }
  }
  return catchItem.copy
}
const deepClone = <T = any>(obj: T): T => {
  const res = deepCopy(obj)
  circleLinks.forEach((item) => {
    item.target[item.key] = item.catchItem.copy
  })
  cacheList = []
  circleLinks = []
  return res
}

export default deepClone
