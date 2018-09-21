//promise

// 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

//Promise对象有以下两个特点。

//（1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

//（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

const promise = new Promise(function(resolve, reject) {
    //...some code

    if(/*异步操作成功*/) {
        resolve(value);
    } else {
        reject(error);
    }
});

//Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

// resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去


//Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。

Promise.then(function(value) {
    //success
}, function(err) {
    //failure
})

//then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。

function timeout(ms) {
    return new Promise((resolve, reject) {
        setTimeout(resolve, ms, 'done');
    });
}

timeout(100).then((value) => {
    console.log(value);
})


// 下面是异步加载图片的例子。

function loadImageAsync(url) {
    return new Promise(function(resolve, reject) {
        const image = new Image();

        image.onload = function() {
            resolve(image);
        };

        image.onerror = function() {
            reject(new Error('Could not load image at ' + url));
        };

        image.src = url;
    })
};

//下面是一个用Promise对象实现的 Ajax 操作的例子。

const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject){
        const handler = function() {
            if(this.redayState !== 4) {
                return;
            }
            if(this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusTest));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });

    return promise;
};

getJSON("/posts.json").then(function(json) {
    console.log('Contents: ' + json);
}, function(err) {
    console.error('it is wrong', error);
});

//上面代码中，getJSON是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个Promise对象。需要注意的是，在getJSON内部，resolve函数和reject函数调用时，都带有参数。


//上面代码中，getJSON是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个Promise对象。需要注意的是，在getJSON内部，resolve函数和reject函数调用时，都带有参数。

Promise.prototype.then();
// Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。它的作用是为 Promise 实例添加状态改变时的回调函数。前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。

Promise.prototype.catch();
// Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。

getJSON('/post.json').then(function(posts){
    //...
}).catch(function(err) {
    console.log(err);
})

Promise.prototype.finally()

// finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

promise.then(result => {})
    .catch(error => {})
    .finally(() => {});

Promise.all()
// Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

const p = Promise.all([p1, p2, p3]);
// p的状态由p1、p2、p3决定，分成两种情况。

// （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

// （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

//上面代码中，Promise.all方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

Promise.race()

// Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

Promise.race([p1, p2, p3]);
// 上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

Promise.resolve()

// 有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。

const jsPromise = Promise.resolve($.ajax('/whatever.json'));
// 上面代码将 jQuery 生成的deferred对象，转为一个新的 Promise 对象。

Promise.reject();

// Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

//加载图片
const preloadImage = function(path) {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = path;
    })
}