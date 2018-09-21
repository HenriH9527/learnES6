//reflect

//Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。

//（1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。

//（2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

//老写法

try {
    Object.defineProperty(target, property, attribites);
    //...success
} catch (error) {
    //...failure
}

//新写法
if(Reflect.defineProperty(target, property, attributes)) {
    //success
} else {
    //failure
}

//（3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。

//老写法
'assign' in Object //trur

//新写法
Reflect.has(Object, 'assign')  //true

//（4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

Proxy(target, {
    set: function(target, name, value, receiver) {
        var success = Reflect.set(target, name, value, receiver);
        if(success) {
            console.log('property ' + name + 'on' + target + 'set to' + value);
        }
        return success;
    }
});

//上面代码中，Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。


var loggedObj = new Proxy(obj, {
    get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
    }
});

//上面代码中，每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。

//有了Reflect对象以后，很多操作会更易读。

//老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75])  //1

//新写法
Reflect.apply(Math.floor, undefined, [1.75])  //1

//Reflect对象一共有 13 个静态方法。

Reflect.apply(target, thisArg, args);
//Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。

// 一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。


Reflect.construct(target, args);
//Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。

Reflect.get(target, name, receiver);
//Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。

Reflect.set(target, name, value, receiver);
// Reflect.set方法设置target对象的name属性等于value。

Reflect.defineProperty(target, name, desc);
// Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。

Reflect.deleteProperty(target, name);
// Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。

Reflect.has(target, name);
// Reflect.has方法对应name in obj里面的in运算符。

Reflect.ownKeys(target);
// Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

Reflect.isExtensible(target);
// Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。

Reflect.preventExtensions(target);
// Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

Reflect.getOwnPropertyDescriptor(target, name);
// Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。

Reflect.getPrototypeOf(target);
//Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

Reflect.setPrototypeOf(target, prototype);
//Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。



//实例：使用 Proxy 实现观察者模式

// 观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

const person = observable({
    name: 'benben',
    age: '25'
});

function print() {
    console.log(`${person.name}, ${person.age}`);
}

observe(print);
person.name = 'daidai';
//daidai,25

//上面代码中，数据对象person是观察目标，函数print是观察者。一旦数据对象发生变化，print就会自动执行。

// 下面，使用 Proxy 写一个观察者模式的最简单实现，即实现observable和observe这两个函数。思路是observable函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数。

const queueObservers = new Set();

const observe = fn => queueObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
    const result = reflect.set(target, key, value, receiver);
    queueObservers.forEach(observer => observer());
    return result;
}