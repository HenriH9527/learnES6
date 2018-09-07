//1.Number.isFinite(), Number.isNaN()

Number.isFinite(15);  //true  用来检测一个数值是否为有限的finite

Number.isNaN(NaN);  //true  用来检查一个值是否为NaN

//2.Number.parseInt(), Number.parseFloat()

//ES5的写法

parseInt('33.99')  //33
parseFloat('1234.345$')  //1234.345

//ES6的写法

Number.parseInt('33.45')  //33
Number.parseFloat('56.56$')  //56.56

//3.Number.isInteger():用来判断一个数值是否为整数
//如果对数据精度的要求较高，不建议使用Number.isInteger()判断一个数值是否为整数。

Number.isInteger('15')  //false

//4.Number.EPSILON  极小的常量  表示1与大于1的最小浮点数之间的差
//通常判断javascript能够接受的最小误差范围

function withinErrorMargin(left, right) {
    return Math.abs(left - right) < Number.EPSILON * Math.pow(2,2);
}
0.1 + 0.2 === 0.3  //false
withinErrorMargin(0.1 + 0.2, 0.3)  //true

//安全整数和Number.isSafeInteger()

//ES6引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER ,从来表示这个范围的上下限

//Number.isSafeInteger() 则用来判断一个整数是否落在这个范围之内

Number.isSafeInteger(235256234265);  //true
Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false

//5.Math的扩展

Math.trunc(7.4)   //7  用于去除一个数的小数部分，返回整数部分

Math.sign()  //用来判断一个数到底是整数、负数，还是零。对于非数值，会先将其转为数值

/**
 * 参数为正数，返回+1；
 * 参数为负数，返回-1；
 * 参数为 0，返回0；
 * 参数-0返回-0;
 * 其他值，返回NaN。
 */