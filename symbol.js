//symbol

let s = Symbol();
typeof s  //"symbol"

//运用symbol 定义一组常量

const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();

function getComplement(color) {
    switch(color) {
        case COLOR_RED:
            return COLOR_GREEN;
        case COLOR_GREEN:
            return COLOR_GREEN;
        default:
            throw new Error('undefined color');
    }
}

//常量使用 Symbol 值最大的好处，就是其他任何值都不可能有相同的值了，因此可以保证上面的switch语句会按设计的方式工作。

//消除魔法字符串

function getArea(shape, options) {
    let area = 0;

    switch(shape) {
        case 'Triangle': //魔法字符串
            area = .5 * options.width * options.height
            break;
        // ...
    }
    return area;
};

getArea('Triangle', { width: 100, height: 100 });  //魔法字符串

// 上面代码中，字符串Triangle就是一个魔术字符串。它多次出现，与代码形成“强耦合”，不利于将来的修改和维护。常用的消除魔术字符串的方法，就是把它写成一个变量。

const shapeType = {
    triangle: 'Triangle'
};

function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            break;
    }
    return area;
};

getArea(shapeType.triangle, { width: 100, height: 100 }); 

// 如果仔细分析，可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。因此，这里就很适合改用 Symbol 值。

const shapeType = {
    triangle: Symbol()
};

//另一个新的 API，Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。

let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
};

Reflect.ownKeys(obj); //["enum","nonEnum",Symbol(my_key)]

//由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

let size = Symbol('size');

class Collection {
    constructor() {
        this[size] = 0;
    }

    add(item) {
        this[this[size]] = item;
        this[size]++;
    }

    static sizeOf(instance) {
        return instance[size];
    }
};

let x = new Collection();
Collection.sizeOf(x)  //0

x.add('foo');
Collection.sizeOf(x); //1

Object.keys(x);  //['0']
Object.getOwnPropertyNames(x); ['0']
Object.getOwnPropertySymbols(x);  //[Symbol(size)]

// Symbol自由的函数

Symbol.for();

Symbol.keyFor();

Symbol.hasInstance();
//当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。

Symbol.isConcatSpreadable();
//对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。

Symbol.species();
//对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。

Symbol.match();
//对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。

Symbol.replace();
//对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。

Symbol.search();
//对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。

Symbol.split();
//对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。

Symbol.iterator();
//对象的Symbol.iterator属性，指向该对象的默认遍历器方法。

Symbol.toPrimitive();
//对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

Symbol.toStringTag();
//对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。

Symbol.unscopables();
//对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。