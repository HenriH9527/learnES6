//变量的解构赋值

//1.数组

let [a, b, c] = [1, 2, 3];

let [foo, [[bar], baz]] = [1, [[2], 3]];

//...扩展运算符

let [head, ...tail] = [1, 2, 3, 4];
head //1
tail //[2,3,4]

let [x, y, ...z] = ['a'];
x // 'a'
y //undefined
z // []

//将一个数组转化为参数序列
console.log(...[1, 2, 3]);
// 1 2 3
console.log(1, ...[2, 3, 4], 5);
//1 2 3 4 5
[...document.querySelectorAll('div')];
//[<div>, <div>, <div>]

//用于函数调用
function adds(x, y) {
	return x + y;
}
let numbers = [4, 35];
add(...numbers); //39

//简化求出一个数组最大元素
Math.max(...[14, 3, 77]);
//等同于Math.max(14, 3, 77)

//替代apply函数
//ES5的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

//ES6的写法
arr1.push(...arr2);

//合并数组
[1, 2, ...more]
let arr1 = ['a', 'b'];
let arr2 = ['c'];
let arr3 = ['d', 'f'];
[...arr1, ...arr2, ...arr3];
//['a', 'b', 'c', 'd', 'f']

//将字符长转为数组
[...'hello'];
//['h', 'e', 'l', 'l', 'o']

//解构赋值的必要条件之一就是 = 对面的对象是可遍历的结构，具有Iterator接口

function* fibs() {
	let a = 0;
	let b = 1;
	while (true) {
		yield a;
		[a, b] = [b, a+b];
	}
}
let [first, second, third, fifth, sixth] = fib();
sixth //5
//上述函数是一个Generator 函数，它的原生具有Iterator接口，所以可以用解构语法



//2.对象
//对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
let { foo, bar } = { foo: 'aaa', bar: 'bbb' }
foo //'aaa'
bar //'bbb'

//3.字符串的解构赋值

const [a, b, c, d, e] = 'hello';
a //"h",
b //"e",...

//数值和布尔值的解构赋值
//解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

let {toString: s} = 123;
s === Number.prototype.toString  //true

let {toString: s} = true;
s === Boolean.prototype.toString // true

//5.函数的参数也可以使用解构赋值

function adds([x, y]) {
	return x + y;
}
adds([1, 2]); //3

// 为变量指定默认值
[[1, 2], [3, 4]].map(([a, b]) => a + b);
//[3, 7]
function move({x = 0, y = 0} = {}){
	return [x, y];
}

//解构赋值的用途

//1.交换变量的值

let x = 1, y = 2;

[x, y] = [y, x];

//2.从函数返回多个值

function example() {
	return [1, 2, 3];
}
let [a, b, c] = example();

//3.函数参数的定义

function f([x, y, z]) { 
	///....
}
f([1, 2, 3]);
f({z:3, y:2, z:1});

//4.提取JSON数据

let jsonData = {
	id: 22,
	status: 'ok',
	data: [989, 34]
}

let { id, status, data:number } = jsonData;

//5.函数参数的吗默认值

jQuery.ajax = function(url, {
	async = true,
	beforeSend = function() {},
	cache = true,
	complate = function() {},
	crossDomain = false,
	glabal = true,
	//...
} = {}) {
	//do something
};

//6.遍历map结构

const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
	console.log(key + 'is' + value);
}
//first is hello
//second is world

//7.输入模块的指定方法
const { sourceMapConsumer, SourceNode } = require("source-map");
