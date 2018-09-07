//字符串的扩展

//1.在原有indexOf的基础上增加了 includes(),startsWith(),endsWith()

/**
 * includes(): 返回boolean ，表示是否找到了参数字符串
 *startsWith(): 返回boolean, 表示参数字符串是否在原字符串的头部
 * endsWith(): 返回boolean，表示参数字符串是否在原字符串的尾部
 **/

let example = 'Hello World!';

example.startsWith('Hello')  //true
example.endsWith('!')  //true
example.includes('o')  //true

//这三个方法都支持第二个参数，表示开始搜索的位置，而endsWith()的第二个参数表示前n个字符

//2.repeat() :返回一个新字符串，表示将原字符串重复n次

'x'.repeat(3)  //"xxx"

//3.padStart()，padEnd()

//padStart() 用于头部补全  padEnd() 用于尾部补全，它们一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。如果原字符串的长度，等于或者大于指定的最小长度，则返回原字符串

'abc'.padStart(10,'0123456789')  //'0123456abc'

'x'.padStart(3)  // '  x'  省略第二个参数 用空格补全

//padStart()的常见用途是为数值补全指定位数

'1'.padStart(10, '0')  //00000000001

//另一个用途是改变字符串格式
'09-12'.padStart(10, 'YYYY-MM-DD');  //"YYYY-09-12"

//4.matchALL() : 返回一个正则表达式在当前字符串的所有匹配

//5.模板字符串
let name = "daidai", time = "today";
`Hello ${name}, how are you ${time}`;
``

//嵌套模板字符串
const tmpl = addrs => `
    <table>
    ${addrs.map(addr => `
        <tr><td>${addr.first}</td></tr>
        <tr><td>${addr.last}</td></tr>        
    `)}
    </table>
`
const data = [
    { first: '<Jane>', last: 'bond' },
    { first: 'lars', last: '<Croft>' }
]

console.log(tmpl(data));

// <table>
//
//   <tr><td><Jane></td></tr>
//   <tr><td>Bond</td></tr>
//
//   <tr><td>Lars</td></tr>
//   <tr><td><Croft></td></tr>
//
// </table>

//引用模板字符串本身 
//写法一
let str = 'return' + '`Hello ${name}!`';
let func = new Function('name', str);
func('Jack')  //"Hello Jack"

//写法二
let str = '(name) => `Hello ${name}!`';
let func = eval.call(null, str);
func('Jack');  //"Hello Jack"

//6.实例：模板编译

//标签模板

jsx`
    <div>
        <input ref ='input' onChange='${this.handleChange}' defaultValue='${this.state.vale}'/>
        ${this.state.value}
    </div>
`

//7.String.raw()  用来充当模板字符串的处理函数，返回一个斜杠都被转义的字符串，对应于替换变量后的模板字符串。

String.raw`Hi\n${2+3}!`;
//返回 " Hi\\5!"

String.raw({raw: 'test'},0, 1, 2);
//'t0e1s2t'

//等同于
String.raw({raw: ['t', 'e', 's', 't']},0, 1, 2);

//String.raw的代码实现

String.raw = function(strings, ...values) {
    let output = "";
    let index;
    for (let index = 0; index < values.length; index++) {
        output += string.raw[index] + values[index];
    }

    output += strings.raw[index];
    return output;
}