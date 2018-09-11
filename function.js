// 函数的扩展
//1.利用参数默认值，可以指定某一个参数不得省略

function throwIfMissing() {
    throw new Error('Missing parameter');
}

function foo(mustBeProviede = throwIfMissing())
{
    return mustBeProviede;
}

foo()  //Error:Missing parameter

//另外，可以将参数默认值设为undefined，表明这个参数是可以省略的。
function foo(optional = undefined) { ... }

//2.rest参数
//用于获取函数的多余参数，这样就不需要arguments对象了。

function add(...values) {
    let sum = 0;
    for (let val of values) {
        sum += val;
    }
    
    return sum;
}

add(2, 5, 3); //10


//arguments变量的写法
function sortNumbers() {
    return Array.prototype.slice.call(arguments).sort();
}

//rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();

//运用rest参数改造数组push方法
function push(array, ...items) {
    items.forEach((item) => {
        array.push(item);
    })
}
let a = [];
push(a, 1, 2, 3);

//3.箭头函数

let getTempItem = id => ({id:1, name:'benben'});

const full = ({first, last}) => first + ' ' + last;

//等同于
function full(person) {
    return person.first + ' ' + person.last;
}

/**
 * 箭头函数有几个使用注意点。
 * （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
 * （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
 * （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
 * （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
 * 
 */


 //双冒号运算符
//函数绑定运算符是并排的两个冒号（::），双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境（即this对象），绑定到右边的函数上面。

foo::bar;
//等同于
bar.bind(foo);

foo::bar(...arguments);
//等同于
bar.apply(foo, arguments);

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return obj::hasOwnProperty(key);
}

//如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

let method = obj::obj.foo;
//等同于
let method = ::obj.foo;

let log = ::console.log;
//等同于
var log = console.log.bind(console);

//尾递归
//函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

function factorial(n) {
    if (n===1) return 1;
    return n * factorial(n-1);
}
//上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n) 。

//改写成尾递归，只会保留一个调用记录  复杂度O(1)

function factorial(n, total) {
    if (n===1) return total;
    return factorial(n-1, n*total);
}

factorial(5, 1);

//Fibonacci数列
function Fibonacci(n) {
    if (n <= 1) {return 1};
    return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(100)  //堆栈溢出

function Fibonacci(n, ac1=1, ac2=1) {
    if (n <= 1) {return ac2};
    
    return Fibonacci( n - 1, ac2, ac1 + ac2 );
}
Fibonacci(100) //5731478440113817200000

//尾递归优化，就是采用“循环”换掉“递归”，减少调用栈  就不会溢出