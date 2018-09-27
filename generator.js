// Generator

// Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。


// 执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。


// 形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

function* helloWorldFGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldFGenerator();

// next方法的参数

// yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

function* f() {
    for(var i=0; true;i++){
        var reset = yield i;
        if (reset) {
            i = -1;
        }
    }
}

var g = f();
g.next();{ value: 0, done: false }
g.next();{ value: 1, done: false }
g.next();{ value: 0, done: false }

// 上面代码先定义了一个可以无限运行的 Generator 函数f，如果next方法没有参数，每次运行到yield表达式，变量reset的值总是undefined。当next方法带一个参数true时，变量reset就被重置为这个参数（即true），因此i会等于-1，下一轮循环就会从-1开始递增。

// 注意，由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。V8 引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。

function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}

for(let i of foo()) {
    console.log(i);
}

//1 2 3 4 5

function *Fibonacci() {
    let [prev, curr] = [0, 1];
    for(;;) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

for(let n of Fibonacci) {
    if(n > 1000) {
        break;
    }
    console.log(n);
}

// 从上面代码可见，使用for...of语句时不需要使用next方法。

// Generator.prototype.throw()
//Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

var g = function* () {
    try{
        yield;    
    } catch(err) {
        console.log('内部捕获',err)
    }
}

var i = g();
i.next();

try{
    i.throw('a');
    i.throw('b');
} catch(err) {
    console.log('外部捕获', err);
}

//内部捕获 a
//外部捕获 b

// 上面代码中，遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。

Generator.prototype.return()

// Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

var f = gen();
g.next();  //{ value: 1, done: false }
g.return('foo'); //{ value: "foo", done: true }
g.next();  //{ value: undefined, done: true }

// 上面代码中，遍历器对象g调用return方法后，返回值的value属性就是return方法的参数foo。并且，Generator 函数的遍历就终止了，返回值的done属性为true，以后再调用next方法，done属性总是返回true。

// yield*后面的 Generator 函数（没有return语句时），等同于在 Generator 函数内部，部署一个for...of循环。

function* concat(iter1, itor2) {
    yield* iter1;
    yield* iter2;
}

//等同于

function* concat(iter1, iter2) {
    for (var value of iter1) {
        yield value;
    }
    for (var value of iter2) {
        yield value;
    }
}

// 上面代码说明，yield*后面的 Generator 函数（没有return语句时），不过是for...of的一种简写形式，完全可以用后者替代前者。反之，在有return语句时，则需要用var value = yield* iterator的形式获取return语句的值。

// 下面是一个稍微复杂的例子，使用yield*语句遍历完全二叉树。

// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树

function Tree(left, label, right) {
    this.left = left;
    this.label = label;
    this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历

function* inorder(t) {
    if(t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}

// 下面生成二叉树
function make(array) {
    //判断是否为叶节点
    if(array.length == 1) return new Tree(null, array[0], null);
    return new Tree(make(array[0], array[1], make(array[2])));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

//遍历二叉树
var result = [];
for (let node of inorder(tree)) {
    result.push(node);
}

result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']

// Generator状态机

var clock = function *() {
    while(true) {
        console.log('Tick');
        yield;
        console.log('Tock');
        yield;
    }
};

// Generator 与协程

// 协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程。

// （1）协程与子例程的差异

// 传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。

// 从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。

// （2）协程与普通线程的差异

// 不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

// 由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

// 异步操作的同步化表达

function* loadUI() {
    showLoadingScreen();
    yield loadUIDataAsynchronously();
    hideLoadingScreen();
}

var loader = loadUI();
//加载UI
loader.next();
//卸载UI
loader.next();

// 上面代码中，第一次调用loadUI函数时，该函数不会执行，仅返回一个遍历器。下一次对该遍历器调用next方法，则会显示Loading界面（showLoadingScreen），并且异步加载数据（loadUIDataAsynchronously）。等到数据加载完成，再一次使用next方法，则会隐藏Loading界面。可以看到，这种写法的好处是所有Loading界面的逻辑，都被封装在一个函数，按部就班非常清晰。
function* main() {
    var result = yield request("http://some.url");
    var resp = JSON.parse(result);
    console.log(resp.value);
}

function request() {
    makeAjaxCall(url, function(response) {
        it.next(response);
    })
}

var it = main();
it.next();

// 下面是另一个例子，通过 Generator 函数逐行读取文本文件。

function* numbers() {
    let file = new FileReader('numbers.txt');
    try {
        while(!file.eof) {
            yield parseInt(file.readLine(), 10);
        }
    } finally {
        file.close();
    }
}

//控制流管理
// 如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样。
step1(function(value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                //Do something with value4
            });
        });
    });
});

// 采用Promise改写

Promise.resolve(step1)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(function (value4) {
        //Do something with value4
    }, function(err) {
        //Handle any error from step1 through step4
    })
    .done();

//Generator 函数可以进一步改善代码运行流程。

function* longRunningTask(value1) {
    try {
        var value2 = yield step1(value1);
        var value3 = yield step2(value2);
        var value4 = yield step3(value3);
        var value5 = yield step4(value4);
        //Do something whith value4
    } catch(err) {
        //Handle any error from step1 thorugh step4
    }
}

// 然后，使用一个函数，按次序自动执行所有步骤。
scheduler(longRunningTask(initialValue));

function scheduler(task) {
    var taskObj = task.next(task.value);
    //如果Generator函数未结束，就继续调用
    if (!taskObj.done) {
        task.value = taskObj.value;
        scheduler(task);
    }
}

let steps = [step1Func, step2Func, step3Func];
// 注意，上面这种做法，只适合同步操作，即所有的task都必须是同步的，不能有异步操作。因为这里的代码一得到返回值，就继续往下执行，没有判断异步操作何时完成。

// 下面，利用for...of循环会自动依次执行yield命令的特性，提供一种更一般的控制流管理的方法。
function* iterateSteps(steps){
  for (var i=0; i< steps.length; i++){
    var step = steps[i];
    yield step();
  }
}



