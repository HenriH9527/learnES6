// Module的语法

// 模块功能主要由两个命令构成：export和import。
// export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

// 最后，export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的import命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

export function f(){
    //...
}

function f(){
    //...
}

export { f };
export { f as g};


import { firstName, lastName, year } from './profile.js';

import { lastName as surname } from './profile.js'


// * 整体加载

export function area(radius) {
    return Math.PI * radius *radius;
}

export function circumference(radius) {
    return 2 * Math.PI * radius;
}

import * as circle from './circle';

// 为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。

export default function foo() {}

// 第一组
export default function crc32() { // 输出
    // ...
  }
  
  import crc32 from 'crc32'; // 输入
  
  // 第二组
  export function crc32() { // 输出
    // ...
  };
  
  import {crc32} from 'crc32'; // 输入

//   上面代码的两组写法，第一组是使用export default时，对应的import语句不需要使用大括号；第二组是不使用export default时，对应的import语句需要使用大括号。

//constants/db.js

export const db = {
    url: 'http://www.abc.com',
    admin_username: 'admin',
    admin_password: 'admin password',
};

//constants/user.js
export const user = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];

//constants/index.js

export {db} from './db';
export {users} from './user';

//script.js

import {db, users} from './constants/index.js';


import()  //引入import()函数，完成动态加载、

// 上面代码中，import函数的参数specifier，指定所要加载的模块的位置。import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。

// import()返回一个 Promise 对象。下面是一个例子。

const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
    .then(module=>{
        module.loadPageInto(main);
    })
    .catch(err => {
        main.textContent = err.message;
    })

    // import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

// （1）按需加载。
GamepadButton.addEventListener('click', event => {
    import('./dialogBox.js')
    .then(dialogBox => {
        dialogBox.open();
    })
    .catch(error => {
        //...
    })
})

// 上面代码中，import()方法放在click事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。

// （2）条件加载

if(condition) {
    import('modulea').then(...);
} else {
    import('moduleb').then(...);
}
// 上面代码中，如果满足条件，就加载模块 A，否则加载模块 B。

// （3）动态的模块路径

import(f())
    .then()
// 上面代码中，根据函数f的返回结果，加载不同的模块。

// import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

import('./myModule.js')
    .then(({export1, export2}) => {
        //...
    })
 // 如果想同时加载多个模块，可以采用下面的写法。
 
 Promise.all([
     import('./module1.js'),
     import('./module2.js'),
     import('./module3.js'),
 ])
 .then(([module1, module2, module3]) => {\
    //...
})

// import()也可以用在 async 函数之中。

async function mian() {
    const myModule = await import('./module.js');
    const {export1, export2} = await import('./myModule.js');
    const [module1, module2, module3] = await Promise.all([
        import('./midule1.js'),
        import('./midule2.js'),
        import('./midule3.js'),
    ])
}
main();


