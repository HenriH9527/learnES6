// Generator 函数的异步应用

// ES6 诞生以前，异步编程的方法，大概有下面四种。

/*
 * 回调函数
 * 事件监听
 * 发布/订阅
 * Promise 对象
 */

 //回调函数实现异步
 fs.readFile('/etc/passwd', 'utf-8', function(err, data) {
     if (err) throw err;
     console.log(data);
 })

//  上面代码中，readFile函数的第三个参数，就是回调函数，也就是任务的第二段。等到操作系统返回了/etc/passwd这个文件以后，回调函数才会执行。

// 一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？

// 原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

//Promise  实现异步
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function(data) {
    console.log(data.toString());
})
.then(function() {
    console.log(data.toString);  
})
.catch(function(err) {
    console.log(err);
})

// 上面代码中，我使用了fs-readfile-promise模块，它的作用就是返回一个 Promise 版本的readFile函数。Promise 提供then方法加载回调函数，catch方法捕捉执行过程中抛出的错误。

// 可以看到，Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

//Generatir 函数实现异步

//协程
// 多个线程互相协作，完成异步任务

// 协程有点像函数，又有点像线程。它的运行流程大致如下：

/**
 * 第一步，协程A开始执行
 * 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
 * 第三步，（一段时间后）协程B交还执行权。
 * 第四步，协程A恢复执行。
 * 
 */

//  读取文件的协程如下：

function* asyncJob() {
    //...
    var f = yield readFile(fileA);
    //...
}

// 上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

// 协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

//协程的Generator函数实现

//Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

//整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。Generator 函数的执行方法如下。

function* gen(x) {
    var y = yield x + 2;
    return y;
}

var g = gen(1);
g.next();  //{ value: 3, done: false }
g.next();  //{ value: undefined, done: true }

//Generator函数的数据交换和错误处理

// Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

// next 返回值的value属性，是Generator函数向外输出数据；next方法还可以接受参数，向Generator函数体内输入数据

function* gen(x){
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next()  //{ value: 3, done: false }
g.next(2) //{ value: 2, done: true }

// 上面代码中，第一个next方法的value属性，返回表达式x + 2的值3。第二个next方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量y接收。因此，这一步的value属性，返回的就是2（变量y的值）。

//Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。

function *gen(x) {
    try {
        var y = yield x + 2;
    } catch(e) {
        console.log(e);
    }
    return y;
}
var g = gen(1);
g.throw("出错了");

//“出错了”

//上面代码的最后一行，Generator 函数体外，使用指针对象的throw方法抛出的错误，可以被函数体内的try...catch代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

// 异步任务的封装

var fetch = require('node-fetch');

function *gen() {
    var url = "https://api.github.com/users/github";
    var result = yield fetch(url);
    console.log(result.bio);
}

// 上面代码中，Generator 函数封装了一个异步操作，该操作先读取一个远程接口，然后从 JSON 格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了yield命令。

var g = gen();
var result = g.next();

result.value.then(function(data) {
    return data.json();
}).then(function(data) {
    g.next(data);
})

//上面代码中，首先执行 Generator 函数，获取遍历器对象，然后使用next方法（第二行），执行异步任务的第一阶段。由于Fetch模块返回的是一个 Promise 对象，因此要用then方法调用下一个next方法。

// 可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。

// Thunk函数

// Thunk函数是自动执行Generator函数的一种方法

// 参数的求值策略

//Thunk函数的含义

// 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

function f(m) {
    return m+2;
}
f(x + 5);

//等同于

var thunk = function() {
    return x + 5;
}

function f(thunk) {
    return thunk() * 2
}
//这就是 Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式。









