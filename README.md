# deepClone

## 介绍
<strong>deepClone 是一个 javascript 深拷贝函数</strong>

支持几乎常见以及绝大多数 javascript 数据类型的数据的深度复制，
默认支持 ES6+ 环境，如果想要支持 ES3、ES5 的话需要在项目中添加 pollfill。

如果有您想要支持但尚未支持的类型，或是现有支持的类型存在问题，欢迎您提一个[Issues](https://github.com/YMaster/js-deep-clone/issues)


## 支持类型
- 基础类型：null、undefined、String、Number、Symbol、Boolean、BigInt、NaN
- Object (包含 js对象、数字对象：Number(1)、字符串对象：String('string')、布尔对象:new Boolean(false))
- Function（尚不支持原型链复制）
- Array
- Date
- RegExp
- Blob（blob属于数据类型，不属于 js 类型，node 中运行的话没法直接 new Blob(), 但浏览器中可以，注意运行环境）
- Set
- Map
- ArrayBuffer、DataView
- TypeArray(Int8Array、Int16Array、Int32Array、Uint8Array、Uint16Array、Uint32Array、Float32Array、Float64Array、Uint8ClampedArray)
- BigArray(BigInt64Array、BigUint64Array)
- 支持对象的循环引用（看下面[示例](#示例)中的 obj.d）

PS: WeakSet 和 WeakMap 由于其内部数据的不计数引用这一特殊性无法复制内部数据，也就不具有复制的能力


## 使用
```bash
# npm
npm i @iusername/js-deep-clone

# yarn
yarn add @iusername/js-deep-clone
```
```javascript
import deepClone from 'deepClone';

const source = {}
const target = deepClone(source)
```

## 示例
```javascript
import deepClone from 'deepClone';

const symbolName = Symbol();
const arrbuf = new ArrayBuffer(12)
const obj = {
  objNumber: new Number(1),
  number: 1,
  objString: new String('ss'),
  string: 'stirng',
  objRegexp: new RegExp('\\w'),
  regexp: /w+/g,
  date: new Date(),
  set: new Set(),
  map: new Map(),
  function: function (value) {
    return this.number + value
  },
  // blob: new Blob([1, 12]),
  int8Array: new Int8Array(10),
  int16Array: new Int16Array(10),
  int32Array: new Int32Array(10),
  uint8Array: new Uint8Array(8),
  uint16Array: new Uint16Array(8),
  uint32Array: new Uint32Array(8),
  arrBuffer: new ArrayBuffer(10),
  dataView: new DataView(arrbuf.slice(), 0, 8),
  uint8ClampedArray: new Uint8ClampedArray(10),
  bigInt: 12n,
  bigIntArray: new BigInt64Array(12),
  bigUintArray: new BigUint64Array(12),
  array: [{ a: 1 }, 2],
  [symbolName]: 111,
  sym: symbolName
}

obj.d = obj;
Object.defineProperty(obj, 'number', {
  writable: false,
  enumerable: true,
  configurable: false,
  value: 2,
})

const o = deepClone(obj)
console.log('number: ', o.number === obj.number);             // number:  true
console.log('string: ', o.string === obj.string);             // string:  true
console.log('objNumber: ', o.objNumber === obj.objNumber);    // objNumber:  false
console.log('objString: ', o.objString === obj.objString);    // objString:  false
console.log('sym: ', o.sym === obj.sym);                      // sym:  true
console.log('objRegexp: ', o.objRegexp === obj.objRegexp);    // objRegexp:  false
console.log('regexp: ', o.regexp === obj.regexp);             // regexp:  false
console.log('date: ', o.date === obj.date);                   // date:  false
console.log('set: ', o.set === obj.set);                      // set:  false
console.log('map: ', o.map === obj.map);                      // map:  false
console.log('function: ', o.function === obj.function);       // function:  false
console.log('int8Array: ', o.int8Array === obj.int8Array);    // int8Array:  false
console.log('int16Array: ', o.int16Array === obj.int16Array); // int16Array:  false
console.log('int32Array: ', o.int32Array === obj.int32Array); // int32Array:  false
console.log('uint8Array: ', o.uint8Array === obj.uint8Array);    // uint8Array:  false
console.log('uint16Array: ', o.uint16Array === obj.uint16Array); // uint16Array:  false
console.log('uint32Array: ', o.uint32Array === obj.uint32Array); // uint32Array:  false
console.log('uint8ClampedArray: ', o.uint8ClampedArray === obj.uint8ClampedArray); // uint32Array:  false
console.log('dataView: ', o.dataView === obj.dataView);         // dataView:  false
console.log('arrBuffer: ', o.arrBuffer === obj.arrBuffer);      // arrBuffer:  false
console.log('array: ', o.array === obj.array);                  // array:  false
console.log('array item: ', o.array[0] === obj.array[0], o.array[1] === obj.array[1]);  // array items:  false true
console.log('symbolName: ', o[symbolName] === obj[symbolName]);   // symbolName:  false
console.log('d: ', o.d === o, o.d === obj.d)                       // d:  true false
obj.function(2)   // 4
o.function(2)     // 4
console.log(o)    // { objNumber: [Number: 1], number: 2, ... , d: [Circular], [Symbol()]: 111 }
console.log(o.d)  // { objNumber: [Number: 1], number: 2, ... , d: [Circular], [Symbol()]: 111 }
console.log(obj)  // { objNumber: [Number: 1], number: 2, ... , d: [Circular], [Symbol()]: 111 }
console.log(Object.getOwnPropertyDescriptor(newObj, 'number')) // { writable: false, enumerable: true, configurable: false, value: 2 }

console.log(deepClone(null))      // null
console.log(deepClone(undefined)) // undefined
console.log(deepClone('123'))     // '123'
console.log(deepClone({}))        // {}
console.log(deepClone(12))        // 12
console.log(deepClone(new ArrayBuffer(20))) // ArrayBuffer{ [Uint8Contents]: <00, 00, ...>, byteLength: 20 }
console.log(deepClone(/abc/))       // /abc/

const date = new Date()
const cloneDate = deepClone(date)
console.log(date, cloneDate, date == cloneDate, date === cloneDate)    // 2020-05-09T05:42:54.818Z 2020-05-09T05:42:54.818Z false false
```

## TODO
- <del>Function 原型链复制</del>
- Proxy 对象（暂且不作为必须功能看待）

## LICENSE
[MIT](https://opensource.org/licenses/MIT)