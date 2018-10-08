// Decorator 修饰器

@testable
class myTestableClass {
    //...
}

function testable(target) {
    target.isTestable = true;
}

myTestableClass.isTestable //true

// 上面代码中，@testable就是一个修饰器。它修改了MyTestableClass这个类的行为，为它加上了静态属性isTestable。testable函数的参数target是MyTestableClass类本身。

// 基本上，修饰器的行为就是下面这样。

@decorator
class A {}

//等同于
class A {}
A = decorator(A) || A;

// 如果觉得一个参数不够用，可以在修饰器外面再封装一层函数。

function testable(isTestable) {
    return function(target) {
        target.isTestable = isTestable;
    }
}

@testable(true)
class myTestableClass {}

myTestableClass.isTestable //true

@testable(false)
class myClass{}
myClass.isTestable  //false

// 注意，修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。

function testable(target) {
    target.prototype.isTestable = true;
}

@testable
class MyTestableClass{}

let obj = new MyTestableClass();
obj.isTestable  //true
// 前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的prototype对象操作。

//mixin.js

export function mixins(...list) {
    return function(target) {
        Object.assign(target.prototype, ...list);
    }
}

//main.js

import {mixins} from './mixins'

const Foo = {
    foo() {console.log('foo')}
}

@mixins(Foo)
class MyClass{}

let obj = new MyClass();
obj.foo()  //'foo'

// 上面代码通过修饰器mixins，把Foo对象的方法添加到了MyClass的实例上面。可以用Object.assign()模拟这个功能。

//方法的修饰
// 修饰器不仅可以修饰类，还可以修饰类的属性。

class Person {
    @readonly
    name() {
        return `${this.first} ${this.last}`
    }
}

function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor; 
}

readonly(Person.prototype, 'name', descriptor);
//类似于
Object.defineProperty(Person.prototype, 'name', descriptor);

// 下面的@log修饰器，可以起到输出日志的作用

class Math {
    @log
    add(a, b) {
        return a + b
    }
}

function log(target, name, descriptor) {
    var oldValue = descriptor.value;

    descriptor.value = function() {
        console.log(`Calling ${name} with`, arguments);
        return oldValue.apply(this, arguments);
    }

    return descriptor;
}

const math = new Math();

math.add(2, 4);

// 上面代码中，@log修饰器的作用就是在执行原始的操作之前，执行一次console.log，从而达到输出日志的目的。

// 修饰器有注释的作用。

@testable
class Person {
    @readonly
    @nonenumerable
    name() {return `${this.first} ${this.last}`}
}

// 从上面代码中，我们一眼就能看出，Person类是可测试的，而name方法是只读和不可枚举的。

// 下面是使用 Decorator 写法的组件，看上去一目了然。

@Component({
    tag: 'my-component',
    styleUrl: 'my-component.scss'
})

export class MyComponent {
    @Prop() first:string;
    @Prop() last:string
    @state() isVisible: boolean = true

    render() {
        return (
            <p>Hello, my name is {this.first} {this.last}</p>
        )
    }
}

// 如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

function dec(id) {
    console.log('evaluated', id);
    return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}

//evaluated 1
// evaluated 2
//executed 2
// executed 1

// 修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。

// core-decorators.js是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。

// (1) @autobind
// autobind修饰器使得方法中的this对象，绑定原始对象。

import {autobind} from 'core-decorators';

class Person {
    @autobind
    getPerson() {
        return this;
    }
}

let person = new Person();
let getPerson = person.getPerson;

getPerson() === person;
//true

// (2) @readonly

// readonly修饰器使得属性或方法不可写。

import {readonly} from 'core-decorators';

class Meal {
    @readonly
    entree = 'steak';
}

var dinner = new Meal();
dinner.entree = 'salmon';
// cannot assgin to read only property 'entree' of [object object]

// (3) @override

class Parent {
    speak(first, second){}
}

class Child extends Parent {
    @override()
    speak() {}
    //SynataxError:...
}

// (4) @deprecate(别名@deprecated)
// deprecate或deprecated修饰器在控制台显示一条警告，表示该方法将废除

import { deprecate } from 'core-decorators';

class Person {
    @deprecate
    facepalm() {}

    @deprecate('We stopped facepalming')
    facepalmHard() {}

    @deprecate('We stopped facepalming', {url :'abcd'})
    facepalmHarder() {}
}
let person = new Person();

person.facepalm();
// DEPRECATION Person#facepalm: This function will be removed in future versions.

person.facepalmHard();
// DEPRECATION Person#facepalmHard: We stopped facepalming

person.facepalmHarder();
// DEPRECATION Person#facepalmHarder: We stopped facepalming
//
//     See http://knowyourmeme.com/memes/facepalm for more details.
//


// (5) @suppressWarnings

// suppressWarnings修饰器抑制deprecated修饰器导致的console.warn()调用。但是，异步代码发出的调用除外。

import {suppressWarnings}  from 'core-decorators'

class Person {
    @deprecated
    facepalm() {}

    @suppressWarnings
    facepalmWithoutWarning() {
        this.facepalm();
    }
}

let person = new Person();

person.facepalmWithoutWarning();

//no warning is logged

// 使用修饰器实现自动发布事件
// 我们可以使用修饰器，使得对象的方法被调用时，自动发出一个事件。

const postal = require("postal/lib/postal.ladash");

export default function publish(topic, channel) {
    const channelName = channel || '/';
    const msgChannel = postal.channel(channelName);
    msgChannel.subscribe(topic, v=>{
        console.log('频道');
    })
}

    return function(target, name, descriptor) {
        const fn = descriptor.value;

        descriptor.value = function() {
            let value = fn.apply(this, arguments);
            msgChannel.publish(topic, value);
        }
    }

    // 上面代码定义了一个名为publish的修饰器，它通过改写descriptor.value，使得原方法被调用时，会自动发出一个事件。它使用的事件“发布/订阅”库是Postal.js。
    // 它的用法如下。

import publish from './publish';

class FooComponent {
    @publish('foo.some.message', 'component')
    someMethod() {
        return {my: 'data'};
    }

    @publish('foo.some.other')
    anotherMethod(){
        //...
    }
}

let foo = new FooComponent();

foo.someMethod();
foo.anotherMethod();
// 以后，只要调用someMethod或者anotherMethod，就会自动发出一个事件。

// Mixin
// 在修饰器的基础上，可以实现Mixin模式。所谓Mixin模式，就是对象继承的一种替代方案，中文译为“混入”（mix in），意为在一个对象之中混入另外一个对象的方法。

const Foo = {
    foo() {console.log('foo')}
};

class MyClass {}

Object.assign(MyClass.protptype, Foo);

let obj = new MyClass();
obj.foo()  //'foo'
// 上面代码之中，对象Foo有一个foo方法，通过Object.assign方法，可以将foo方法“混入”MyClass类，导致MyClass的实例obj对象都具有foo方法。这就是“混入”模式的一个简单实现。

// 目前，Babel 转码器已经支持 Decorator。

// npm install babel-core babel-plugin-transform-decorators

{
    "plugins": ["transform-decorators"]
  }




