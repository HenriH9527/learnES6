//数组的扩展

//1.Map 和 Set结构，Generator函数

let map = new Map([
    [1, 'one'],
    [1, 'two'],
    [1, 'three'],
]);

let arr = [...map.keys()];  //[1,2,3]

const go = function* () {
    yield 1;
    yield 2;
    yield 3;
}
[...go()];  //[1,2,3]

//2.Array.from()

let arrLike = {
    '0': 'a',
    '0': 'b',
    '0': 'c',
    '0': 'd',
    length: 3
}

//es5写法 
let arr1 = [].slice.call(arrayLike);

//es6写法

let arr2 = Array.from(arrayLike);

//对于低版本的浏览器可以使用Array.prototype.slice 代替
const toArray = (() = > Array.from ? Array.from : [].slice.call())()

//3.Array.of()  将一组值转换为数组

Array.of(3, 11, 8);  //[3, 11, 8]

//4.copyWithin()
//数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

Array.prototype.copyWithin(target, start=0, end=this.length)

[1, 2, 3, 4, 5].copyWithin(0, 3)  //[4, 5, 3, 4, 5]

//上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。

//5.数组实例的find()  和 findIndex()

[1, 4, -5, 10].find((n) => n < 0);
//-5

[1, 5, 10, 15].findIndex(function(value, index, arr){
    return value > 9;
})

//2

//数组实例的 fill()
['a', 'b', 'c'].fill(7);
//777

//上面代码表明，fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去。
['a', 'b', 'c'].fill(7, 1, 2);
//['a', 7, 'c']

//上面代码表示，fill方法从 1 号位开始，向原数组填充 7，到 2 号位之前结束。

//数组实例的entries(), keys() 和values()
//keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

for (let index of ['a', 'b'].keys()) {
    console.log(index);
}//0 1

for(let elem of ['a', 'b'].values()) {
    console.log(elem);
}//'a' 'b'

for(let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
}//0 'a' 1 'b'

//数组实例的flat()  flatMap()
[1, 2, [3, 4]].flat()
//[1, 2, 3, 4]

//上面代码中，原数组的成员里面有一个数组，flat()方法将子数组的成员取出来，添加在原来的位置。

//flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。

[2, 3, 4].flatMap((x) => [x, x*2])
//[2,4,3,5,4,8]

[2, 3, 4].flatMap(x => [[x * 2]])

//[[2], [4], [6], [8]]

//6.数组的空位

/**
 * ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位。
 * forEach(), filter(), reduce(), every() 和some()都会跳过空位。
 * map()会跳过空位，但会保留这个值
 * join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。
 */

 //ES6 则是明确将空位转为undefined。