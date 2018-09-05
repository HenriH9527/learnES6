/*let与const纠正了var命令的变量提升现象，也为jvascript提供了块级作用域，
*只要在一个区块中存在const和let命令，那么这个区块就形成了封闭作用域，也
*称“暂时性时区（temporal dead zone,简称TDZ）”
*
*/

if (true){
	//TDZ开始
	tmp = "abc"; //ReferenceError
	console.log(tmp); //ReferenceError

	let tmp;  //TDZ结束
	console.log(tmp);  //undefined

	tmp = 123;
	console.log(tmp);  //123
}

//一些比较隐藏的暂时性死区

function bar(x = y, y = 2) {
	return [x, y];
}
bar() //报错

//x=y  而参数 y 此时还没有被声明，所以会报错

/*global 对象 
**--浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
**--浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
**--Node 里面，顶层对象是global，但其他环境都不支持。
*/

//下面是提供的两种勉强可以获得顶层对象的方法

//方法一
(typeof window !== 'undefined' ? window : (typeof process === 'object' && 
	typeof require === 'function' && typeof global === 'object')
	? global : this);

//方法二
var getGlabal = function () {
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object!');
}

//垫片库system.global 模拟了这个提案

//保证global对象都存在

//commonJS 写法
require('system.global/shim')();

//ES6 module
import shim from 'system.global/shim';
shim()

//将顶层对象放入global

//commonJS 写法
var global = require('system.global')();

//ES6 module
import getGlobal from 'system.global';
const global = getGlobal();