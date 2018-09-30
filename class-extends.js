// Class的继承

class point {
    constructor(x) {
        this.x = x;
    }

    toString() {
        return this.x
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y);  //调用父类的constructor(x, y)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toSring(); //调用父类的toSring()
    }
}

// 上面代码中，constructor方法和toString方法之中，都出现了super关键字，它在这里表示父类的构造函数，用来新建父类的this对象。

// 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

class ColorPoint extends Point {
    constructor() {

    }
}

let cp = new ColorPoint();  //ReferenceError


// 另一个需要注意的地方是，在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        this.color = color; //Reference Error
        super(x, y);
        this.color = color; //正确
    }
}

// Object.getPrototypeOf()  可以用来从子类上获取父类

//super 关键字
// super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

// 第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。

class A {}

class B extends A {
    construrtor() {
        super();
    }
}

// 上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

// 注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。

class A {
    constructor() {
        console.log(new.target.name);
    }
}

class B extends A {
    constructor() {
        super()
    }
}

new A()  //A
new B()  //B

// 上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。

// 第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

``

class A {
    P() {
        return 2;
    }
}

class B extends A {
    constructor() {
        super();
        console.log(super.p());
    }
}

let b = new B()

// 上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。

// 这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。/

class  A {
    constructor() {
        this.p = 2;
    }
}

class B extends A {
    get m() {
        return super.p;
    }
}

let b = new B();

b.m  //undefined

// 上面代码中，p是父类A实例的属性，super.p就引用不到它。

// 如果属性定义在父类的原型对象上，super就可以取到。

class A {}

A.prototype.x = 2;

class B extends A {
    constructor () {
        super();
        console.log(super.x);  //2
    }
}

let b = new B();

// 上面代码中，属性x是定义在A.prototype上面的，所以super.x可以取到它的值。

