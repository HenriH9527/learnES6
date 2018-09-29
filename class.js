// Class的基本用法

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
}

// 私有方法和属性

class Widget {
    //公有方法
    foo(baz) {
        this._baz(baz);
    }

    //私有方法
    _baz(baz) {
        return this.snaf = baz;
    }
}

// 上面代码中，_bar方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法。

// 另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。

class Widget {
    foo(baz) {
        bar.call(this, baz);
    }
}

function bar(baz) {
    return this.snaf = baz;
}

// 上面代码中，foo是公有方法，内部调用了bar.call(this, baz)。这使得bar实际上成为了当前模块的私有方法。

// 还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。

const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{
    //公有方法

    foo(baz) {
        this[baz](baz);
    }

    [bar](baz) {
        return this[snaf] = baz;
    }
}

// 上面代码中，bar和snaf都是Symbol值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果。

//this的指向

class logger {
    printName(name = "there") {
        this.printName(`Hello ${name}`);
    }

    print(text) {
        console.log(text);
    }
}

const logger = new logger();
const {printName} = logger;
printName();//typeError...

// 上面代码中，printName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到print方法而导致报错。

// 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。

class logger {
    constructor() {
        this.printName = this.printName.bind(this);
    }
}

// 另一种解决方法是使用箭头函数。

class logger {
    constructor() {
        this.printName = (name="there") => {
            this.print(`Hello ${name}`);
        }
    }
}

// 还有一种解决方法是使用Proxy，获取方法的时候，自动绑定this。

function selfish(target) {
    const cache = new WeakMap();
    const handler = {
        get (target, key) {
            const value = Reflect.get(target, key);
            if(typeof value !== "function") {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    };
    const proxy = new Proxy(target, handler);
    return proxy;
}

const logger = selfish(new logger());


// Class 的取值函数（getter）和存值函数(setter)
// 与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

class myClass {
    constructor() {
        //...
    }

    get prop() {
        return 'getter';
    }

    set prop(value) {
        return 'setter';
    }
}

let inst = new myClass();

inst.porp = 123;
//setter

inst.prop
//getter

// 存值函数和取值函数是设置在属性的 Descriptor 对象上的

class CustomHTMLElement {
    constructor(element) {
        this.element = element;
    }

    get html() {
        return this.element.innerHTML;
    }

    set html(val) {
        this.element.innerHTML = val;
    }
}

var descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype, "html"
);

"get" in descriptor //true
"set" in descriptor  //true


// Class 的 Generator的方法

class Foo {
    constructor(...args) {
        this.args = args;
    }
    
    * [Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }
    }
}
for (let x of new Foo('hello', 'world')) {
    console.log(x);
}
//hello
//world

// Class 的静态方法

// 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

class Foo {
    static classMethod() {
        return 'hello';
    }
}

Foo.classMethod();  //'hello'

var foo = new Foo();
foo.classMethod()
//TypeError: foo.classMethod is not a function

//上面代码中，Foo类的classMethod方法前有static关键字，表明该方法是一个静态方法，可以直接在Foo类上调用（Foo.classMethod()），而不是在Foo类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法

// 注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。

class Foo {
    static bar () {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}

// 上面代码中，静态方法bar调用了this.baz，这里的this指的是Foo类，而不是Foo的实例，等同于调用Foo.baz。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。

//父类的静态方法，可以被子类继承。

class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo{
    
}

Bar.classMethod()  //'hello'

// 静态方法也是可以从super对象上调用的。

class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + ',too';
    }
}

Bar.classMethod()  //'hello , too'

// new.targte 属性

// new是从构造函数生成实例对象的命令。ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

function Person(name) {
    if (new.target !== undefined) {
        this.name = name;
    } else {
        throw new Error('必须使用new 命令生成实例');
    }
}

// 子类继承父类时，new.target会返回子类。

// 利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。

class Shape {
    constructor() {
        if (new.target === shape) {
            throw new Error('//...');
        }
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super();
    }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  //正确

// 上面代码中，Shape类不能被实例化，只能用于继承。

// 注意，在函数外部，使用new.target会报错。



