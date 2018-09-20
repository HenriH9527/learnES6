//proxy

//Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

// Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

let obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});

obj.count = 1;
//setting count!

++obj.count
//getting count!
//seting count!
//2

//上面代码说明，Proxy 实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。

//Es6提供Proxy构造函数，用来生成Proxy实例

let porxy = new Proxy(target, handler);

//new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

let proxy = new Proxy({}, {
    get: function(target, property) {
        return 35;
    }
});

proxy.time //35
proxy.name //35
proxy.age //35

var handle = {
    get: function(target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        return "Hello, " + name;
    },

    apply: function(target, thisBinding, args) {
        return args[0];
    },

    construct: function(target, args) {
        return {value: args[1]};
    }
};

var fproxy = new Proxy(function(x, y) {
    return x + y;
}, handle);

fproxy(1, 2);  //1

new fproxy(1, 2); //{value:2}

fproxy.prototype === Object.prototype  //true
fproxy.foo === "Hello, foo"  //true

//下面是 Proxy 支持的拦截操作一览，一共 13 种。

/**
 * 
 * get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
 * 
set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。

deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。

ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。

getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。

getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。

isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。

setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
 * 
 */


//下面的例子使用get拦截，实现数组读取负数的索引。

function createArray(...elements) {
    let handle = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if(index < 0) {
                prokey = String(target.length + index);
            }
            return Reflect.get(target, propkey, receiver);
        }
    }
    let target = [];
    target.push(...elements);
    return new Proxy(target, handle);
}

let arr = createArray('a', 'b', 'c');
arr[-1];  //c


//set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

let validator = {
    set: function(obj, prop, value) {
        if (prop === "age") {
            if (!Number.isInteger(value)) {
                throw new TypeError('the age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('the age seems invalid');
            }

            abj[prop] = value;
        }
    }
}

let person = new Proxy({}, validator);

// 面代码中，由于设置了存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误，这是数据验证的一种实现方法。利用set方法，还可以数据绑定，即每当对象发生变化时，会自动更新 DOM。



//apply方法拦截函数的调用、call和apply操作。

//apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。

var target = function() { return 'i am the target'; };
var handler = {
    apply: function() {
        return 'I am the proxy';
    }
};

var p = new Proxy(target, handler);

p();

//i am the proxy

// 上面代码中，变量p是 Proxy 的实例，当它作为函数调用时（p()），就会被apply方法拦截，返回一个字符串。

// has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。

var handler = {
    has (target, key) {
        if(key[0] === '_') {
            return false;
        }
        return key in target;
    }
}
//上面代码中，如果原对象的属性名的第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。

// construct方法用于拦截new命令，下面是拦截对象的写法。construct方法可以接受两个参数。

// target：目标对象
// args：构造函数的参数对象
// newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）

var p =new Proxy(function() {}, {
    construct: function(target, args) {
        console.log('called:' + args.join(', '));
        return { value: args[0] * 10 };
    }
});

(new p(1)).value
//"called:1"
//10


//deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。

var handler = {
    deleteProperty(target, key) {
        invariant(key, 'delete');
        delete target[key];
        return true;
    }
}
function invariant (key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action}!`);
    }
}

var target = {_prop: 'foo'};
var proxy = new Proxy(target, handler);
delete proxy._prop
//ERROR

//defineProperty方法拦截了Object.defineProperty操作。

var handler = {
    defineProperty(target, key, descriptor) {
        return false;
    }
}

var target ={};
var proxy = new Proxy(target, handler);

proxy.foo = 'bar'  //不会生效

//getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。

var handler = {
    getOwnPropertyDescriptor(target, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
}

var target = {_foo: 'bar', baz: 'tar'};
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat');
//undefined

Object.getOwnPropertyDescriptor(proxy, '_foo');
//undefined

Object.getOwnPropertyDescriptor(proxy, 'baz');
//{value:'tar',writable:true,...}


//getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。

/**
 * Object.prototype.__proto__
 * 
 * Object.prototype.isPrototypeOf()
 * 
 * Object.getPrototypeOf()
 * 
 * Reflect.getPrototypeOf()
 * 
 * instanceof
 */

 var proto = {};
 var p = new Proxy({}, {
     getPrototypeOf(target) {
         return proto;
     }
 })

 Object.getPrototypeOf(p) === proto  //true

 //上面代码中，getPrototypeOf方法拦截Object.getPrototypeOf()，返回proto对象。

//  isExtensible方法拦截Object.isExtensible操作。

var p = new Proxy({}, {
    isExtensible: function(target) {
        console.log("called");
        return true;
    }
})

Object.isExtensible(p);
//true

// 上面代码设置了isExtensible方法，在调用Object.isExtensible时会输出called。

//ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。

/**
 * Object.getOwnPropertyNames()
 * 
 * Object.getOwnPropertySymbols()
 * 
 * Object.keys()
 * 
 * for...in循环
 */

 let target = {
     a:1,
     b:2,
     c:3
 }

 let handler = {
     ownKeys(target) {
         return ['a'];
     }
 }

 let proxy = new Proxy(target, handler);

 Object.keys(proxy);
 //['a']

//  preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。

var p = new Proxy({}, {
    preventExtensions: function(target) {
        return true;
    }
})

Object.preventExtensions(p)
//error
// 上面代码中，proxy.preventExtensions方法返回true，但这时Object.isExtensible(proxy)会返回true，因此报错。
//为了防止出现这个问题，通常要在proxy.preventExtensions方法里面，调用一次Object.preventExtensions。

//setPrototypeOf方法主要用来拦截Object.setPrototypeOf方法。
var handler = {
    setPrototypeOf(target, proto) {
        throw new Error('changing the prototype is forbidden');
    };
}

var proto = {}
var target = function() {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);

//error:changing the prototype is forbidden

// Proxy.revocable方法返回一个可取消的 Proxy 实例。

let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked

//roxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。


// 虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。

// Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端。

const service = createWebService('http://example.com/data');

service.employees().then(json => {
    const employees = JSON.parse(json);
});

//上面代码新建了一个 Web 服务的接口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 Proxy 拦截就可以了。

function createWebService(baseUrl) {
    return new Proxy({}, {
        get(target, propKey, receiver) {
            return () => httpGet(baseUrl + '/' + propKey)
        }
    })
}