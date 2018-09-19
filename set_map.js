//  set    map

//ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

const s = new set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for(let i of s) {
    console.log(i);
}
//2,3,5,4

const set = new Set([1,2,3,4,4]);
[...set];
//[1,2,3,4] 


//set的实例和方法

// Set结构的实例有以下属性。
/**
 * Set.prototype.constructor:构造函数，默认就是set函数
 * Set.prototype.size: 返回set实例的成员总数
 */

 //Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

 /**
  * add(value)：添加某个值，返回 Set 结构本身。
  * delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
  * has(value)：返回一个布尔值，表示该值是否为Set的成员。
  * clear()：清除所有成员，没有返回值。
  */

  //Set 结构的实例有四个遍历方法，可以用于遍历成员。
  /**
   * keys()：返回键名的遍历器
   * values()：返回键值的遍历器
   * entries()：返回键值对的遍历器
   * forEach()：使用回调函数遍历每个成员
   */

   //WeakSet
   //WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。
   //首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
   //WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

   const ws = new WeakSet();
   const a = [[1, 2], [3, 4]];

   const ws = new WeakSet(a);
   //WeakSet {[1 ,2], [3, 4]}

   //WeakSet 结构有以下三个方法。
   /**
    * WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
    * WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
    * WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
    */


    //map

    const itmes = [
        ['name', '张三'],
        ['title', 'Auther']
    ]

    const map = new Map();

    items.forEach(
        ([key, value]) => map.set(key,value)
    );

    map.get('name'); //张三
    map.has('name'); //true
    map.size(); //2
    map.delete('name'); //true
    map.clear();
    map.size(); //0
//Map 结构原生提供三个遍历器生成函数和一个遍历方法。

/**
 * keys()：返回键名的遍历器。
 * values()：返回键值的遍历器。
 * entries()：返回所有成员的遍历器。
 * forEach()：遍历 Map 的所有成员。
 */

 for(let key of map.keys()) {
     console.log(key); //name title
 };

 for(let value of map.values()) {
     console.log(value); //"张三" "Auther"
 };

 for(let [key,value] of map.entries()) {
     console.log(key, value); //name 张三 title Auther
 }

 const map1 = new Map(
    [...map0].filter(([k, v]) => k < 3)
  );

  //(1) Map转为数组

const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

//(2)数组转为Map
new Map([
    [true, 7],
    [{foo: 3}, ['abc']]
  ])

//（3）Map 转为对象
function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }
  
  const myMap = new Map()
    .set('yes', true)
    .set('no', false);
  strMapToObj(myMap)
  // { yes: true, no: false }

  //（4）对象转为 Map
  function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }
  
  objToStrMap({yes: true, no: false})
  // Map {"yes" => true, "no" => false}

  //（5）Map 转为 JSON
  //Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。
  function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
  }
  
  let myMap = new Map().set('yes', true).set('no', false);
  strMapToJson(myMap)
  // '{"yes":true,"no":false}'

  //另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。
  function mapToArrayJson(map) {
    return JSON.stringify([...map]);
  }
  
  let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
  mapToArrayJson(myMap)
  // '[[true,7],[{"foo":3},["abc"]]]'

  //（6）JSON 转为 Map
  function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
  }
  
  jsonToStrMap('{"yes": true, "no": false}')
  // Map {'yes' => true, 'no' => false}

  //但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作。

  function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
  }
  
  jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
  // Map {true => 7, Object {foo: 3} => ['abc']}
