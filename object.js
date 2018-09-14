//对象的扩展

//CommonJS模块输出一组变量

let ms = {};

function getItem(key) {
    return key in ms ? ms[key] : null;
}

function setItem(key, value) { 
    ms[key] = value;
}

function clear() {
    ms = {};
}

module.exports = {
    getItem: getItem,
    setItem: setItem,
    clear: clear
};

//属性赋值器  setter 和取值器 getter

const cart = {
    _wheels: 4,

    get wheels() {
        return this._wheels;
    },

    set wheels(value) {
        if (value < this._wheel) {
            throw new Error('数值太小了！');
        }
        this._weels = value;
    }
};

//如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。

const obj = {
    get test() {},
    set test(value) {},
}

let descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name  //"get test";
descriptor.set.name  //"set test";


//ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。

//ES6提出“Same-value equality” 同值相等
//object.is() 就是部署这个算法的新方法

+0 === -0; //true
NaN === NaN;  //false

Object.is(+0, -0);  //false
Object.is(NaN, NaN); //true

//ES5可以通过下面代码部署Object.is()

Object.defineProperty(Object, 'is', {
    value: function(x, y) {
        if (x === y) {
            //针对 +0  === -0  true
            return x !== 0 || 1 / x === 1 / y
        }
        //针对 NaN === NaN  false
        return x !==x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true
})

Object.assign()  //用于对象的合并

const target = {a:1, b:1}
const source1 = {b:2, c:3}
const source2 = {c:3}

Object.assign(target, source1, source2)
//{a:1, b:2, c:3}

//为对象添加方法

Object.assign(someClass.prototype, {
    someMethod(arg1, arg2) {
        //...
    },
    anotherMethod() {
        //...
    }
})

//等同于

someClass.prototype.someMethod = function (arg1, arg2) {
    //...
}

someClass.prototype.anotherMethod = function() {
    //...
}

//克隆对象
function clone (origin) {
    return Object.assign({}, origin);
}

// 上面代码将原始对象拷贝到一个空对象，就得到了原始对象的克隆。

// 不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。

function clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    Object.assign(Object.create(originProto), origin);
}

//合并多个对象

const merge = (target, ...sources) => Object.assign(target, ...sources);

//属性的遍历

//for...in     Object.key(obj)   Object.getOwnPropertyNames(obj)   Object.getOwnProtertySymbols(obj)  Reflect.ownKeys(obj)

/**
 * 以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
 * 首先遍历所有数值键，按照数值升序排列。
 * 其次遍历所有字符串键，按照加入时间升序排列。
 * 最后遍历所有 Symbol 键，按照加入时间升序排列。
 */

 //Object.getOwnPropertyDescriptors方法返回一个对象，所有原对象的属性名都是该对象的属性名，对应的属性值就是该属性的描述对象。

 //ES5实现该方法

 function getOwnpropertyDescriptors(obj) {
     const result = {};
     for (let key of Reflect.ownKeys(obj)) {
         result[key] = Object.getOwnpropertyDescriptor(obj, key)
     }
     return result;
 }

 //Object.getOwnPropertyDescriptors 也可以用来实现Mixin模式

 let mix = (object) => ({
    with: (...mixins) => mixins.reduce(
      (c, mixin) => Object.create(
        c, Object.getOwnPropertyDescriptors(mixin)
      ), object)
});

let a = {a: 'a'};
let a = {b: 'b'};
let a = {c: 'c'};
let d = mix(c).with(a, b);

d.a  //"a"
d.b  //"b"
d.c  //"c"

//__proto__ 属性 ， Object.setPrototypeOf(), Objcet.getPrototypeOf()

//es5的写法

const obj = {
    method: function() {}
}
obj.__proto__ = someOtherObj;

//es6的写法
let obj = Object.create(someOtherObj);
obj.method = function() {}

//无论从语义的角度，还是从兼容性的角度，都不要使用__proto__，而是使用下面的
//Object.setPrototypeOf()   object.getProtoTypeOf()   object.create()


//实现上，__proto__调用的是Object.prototype.__proto__,具体实现如下

Object.defineProperty(Object.prototype, '__proto__', {
    get() {
        let _thisObj = Object(this);
        return Object.getPrototypeOf(_thisObj);
    },
    set(proto) {
        if(this === undefined || this === null) {
            throw new TypeError();
        }
        if(!isObject(this)) {
            return undefined;
        }
        if(!isObjet(proto)) {
            return undefined;
        }
        let status = Reflect.setPrototypeOf(this, proto);
        if (!status) {
            throw new TypeErrpr();
        }
    },
});

function isObject(value) {
    return Object(value) === value;
}

//Object.setPrototypeOf方法的作用与__proto__相同，用来设置一个对象的prototype对象，返回参数对象本身

const o = Object.setPrototypeOf({}, null);

// 该方法等同于下面的函数
function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

let proto = {};
let obj = {x:10};
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x  //10
obj.y  //20
obj.z  //40

//Object.getPrototypeOf()  用来读取一个对象的原型对象

function Rectangle() {
    //...
}

const res = new Rectangle();

Objet.getPrototypeOf(rec) === Rectangle.prototype;
//true

Object.setPrototypeOf(rec, Object.prototype);
Object.getPrototypeOf(rec) === Rectangle.prototype;
//false

//super 关键字

//我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。

const proto = {
    foo: 'Hello'
};

const obj = {
    foo: 'world',
    find() {
        return super.foo;
    }
};

Object.setPrototypeOf(obj, proto);
obj.find()  //"Hello"

//上面代码中，对象obj的find方法之中，通过super.foo引用了原型对象proto的foo属性。

const proto = {
    x: 'hello',
    foo() {
        console.log(this.x);
    }
}

const obj = {
    x: 'world',
    foo() {
        super.foo();
    }
}

Object.setPrototypeOf(obj, proto);

obj.foo()  //"world"

// 上面代码中，super.foo()指向原型对象proto的方法，但是绑定的this却还在当前对象obj里，因此输出是‘world’

// Object.keys()，Object.values()，Object.entries()
// Object.keys()

