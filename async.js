//async
// Generator 函数的语法糖。

// Generator函数依次读取两个文件

const readFile = function(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, function(error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};

const gen = function* () {
    const f1 = yield readFile('/etc/abc');
    const f2 = yield readFile('/etc/bcd');
    console.log(f1.toString());
    console.log(f2.toString());
}

//写成async函数。就是下面这样

const asyncReadFile = async function() {
    const f1 = await readFile('/etc/abc');
    const f2 = await readFile('/etc/bcd');
    console.log(f1.toString());
    console.log(f2.toString());
}

// 一比较就会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

// async函数对 Generator 函数的改进，体现在以下四点。

/**
 * （1）内置执行器。
 * Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行。
 * 
 * （2）更好的语义。
 * async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
 * 
 * （3）更广的适用性。
 * co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
 * 
 * （4）返回值是 Promise。
 * async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。
 * 
 * 进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。
 * 
 * 
 */


 //async函数基本用法

 //async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

 async function getStockPriceByName(name) {
     const symbol = await getStokeSymbol(name);
     const stockPrice = await getStokePrice(symbol);
     return stockPrice;
 }

 getStockPriceByName('goog').then(function(){
     console.log(result);
 })

//  上面代码是一个获取股票报价的函数，函数前面的async关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个Promise对象。

// 下面是另一个例子，指定多少毫秒后输出一个值。

function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);

// 由于async函数返回的是 Promise 对象，可以作为await命令的参数。所以，上面的例子也可以写成下面的形式。

async function timeout(ms) {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);

// async 的多种使用形式

//函数声明
async function foo() {}

// 函数表达式
const foo = async function() {}

// 对象的方法
let obj = { async foo() {} };
obj.foo().then()

//class的方法
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }

    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}

const storage = new Storage();
storage.getAvatar('jake').then(...);

//箭头函数
const foo = async () => {};

//Promise 对象的状态变化
async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/..../i)[1];
}
getTitle('https://www.github.com').then(console.log);

// 上面代码中，函数getTitle内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行then方法里面的console.log。

// 正常情况下，await命令后面是一个 Promise 对象。如果不是，会被转成一个立即resolve的 Promise 对象。

// 有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。

async function f() {
    try {
        await Promise.reject('something is wrong');
    } catch(err) {
        console.log(err)
    }
    return await Promise.resolve('hello world');
}
f()
.then(v => console.log(v));
//hello world

//写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

//写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;

// 上面两种写法，getFoo和getBar都是同时触发，这样就会缩短程序的执行时间。


// 如果确实希望多个请求并发执行，可以使用Promise.all方法。当三个请求都会resolved时，下面两种写法效果相同。

async function dbFuc(db) {
    let doc = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results); 
}

//或者使用下面的写法

async function dbFun(db) {
    let doc = [{}, {}, {}];
    let promises = doc.map((doc) => {db.post(doc)});

    let results = [];
    for(let promise of promises) {
        results.push(await promise);
    }
    console.log(results)
}

// 假定某个 DOM 元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值。

// Promise的写法

function chainAnimationsPromise(elem, animations) {
    //变量ret用来保存上一个动画的返回值
    let ret = null;

    //新建一个空的Promise
    let p = Promise.resolve();

    //使用then方法，添加所有动画
    for(let anim of amimations) {
        p = p.then(function(){
            ret = val;
            return anim(elem);
        })
    }

    //返回一个部署了错误捕捉机制的Promise
    return p.catch(function(e){
        /* 忽略错误，继续执行 */
    }).then(function(){
        return ret;
    })
}
// 虽然 Promise 的写法比回调函数的写法大大改进，但是一眼看上去，代码完全都是 Promise 的 API（then、catch等等），操作本身的语义反而不容易看出来。

// Generator写法

function chainAnimationGenerator(elem, animations) {
    return spawn(function* () {
        let ret = null;
        try {
            for (let anim of animations) {
                ret = yield anim(elem);
            }
        } catch(e) {
           /* 忽略错误，继续执行 */ 
        }
        return ret;
    })
}
// 上面代码使用 Generator 函数遍历了每个动画，语义比 Promise 写法更清晰，用户定义的操作全部都出现在spawn函数的内部。这个写法的问题在于，必须有一个任务运行器，自动执行 Generator 函数，上面代码的spawn函数就是自动执行器，它返回一个 Promise 对象，而且必须保证yield语句后面的表达式，必须返回一个 Promise。

// async函数

async function chainAnimationsAsync(elem, animations) {
    let ret = null;
    try {
        for(let anim of animations) {
            ret = await amim(elem)
        }
    } catch(e) {
         /* 忽略错误，继续执行 */ 
    }
    return ret;
}
// 可以看到 Async 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 Generator 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用 Generator 写法，自动执行器需要用户自己提供。

// 实例 按顺序完成异步操作

// promise的写法

function readFile(urls) {
    //远程读取所有URL
    const textPromises = urls.map(url => {
        return fetch(url).then(response => response.text());
    });

    //按次序输出
    textPromises.reduce((chain, textPromise) => {
        return chain.then(()=> textPromise)
            .then(text => console.log(text));
    }, Promise.resolve());
}

// 上面代码使用fetch方法，同时远程读取一组 URL。每个fetch操作都返回一个 Promise 对象，放入textPromises数组。然后，reduce方法依次处理每个 Promise 对象，然后使用then，将所有 Promise 对象连起来，因此就可以依次输出结果。

// 这种写法不太直观，可读性比较差。下面是 async 函数实现。

async function readFile(urls) {
    for(const url of urls) {
        const response = await fetch(url);
        console.log(await response.text);
    }
}

// 上面代码确实大大简化，问题是所有远程操作都是继发。只有前一个 URL 返回结果，才会去读取下一个 URL，这样做效率很差，非常浪费时间。我们需要的是并发发出远程请求

async function readeFile(urls) {
    //并发读取URL
    const textPromises = urls.map(async url => {
        const response = await fetch(url);
        return response.text();
    })

    //按次序输出
    for (const textPromise of textPromises) {
        console.log(await textPromise);
    }
}

// 上面代码中，虽然map方法的参数是async函数，但它是并发执行的，因为只有async函数内部是继发执行，外部不受影响。后面的for..of循环内部使用了await，因此实现了按顺序输出。

















 