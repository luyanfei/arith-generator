var range = require('lodash/range')
var sample = require('lodash/sample')
var times = require('lodash/times')

//算式中需要填充的数值用VACANCY来替换
var VACANCY = '□';
var OPERATORS = ['add', 'sub', 'mul', 'div'];

//op table
var opt = {
    add: {
        func: (a,b) => a+b,
        sym: '+'
    },
    sub: {
        func: (a,b) => a-b,
        sym: '-'
    },
    mul: {
        func: (a,b) => a*b,
        sym: '×'
    },
    div: {
        func: (a,b) => a/b,
        sym: '÷'
    }
}

//二元运算符的算式，如：3+4=7，5*3=15等。
//op的取值为add,sub,mul,div。
//默认情况下，掩掉result。
//a + b = result 数组形式
//0 1 2 3 4      相应下标
function formula(a, b, op='add', mask=4) {
    var sign = opt[op].sym
    var result = opt[op].func(a, b)
    //数组形式
    var formulaArray = [a, sign, b, '=', result]
    //掩掉填充位的数组形式
    var maskedArray = formulaArray.slice(0);
    maskedArray[mask] = VACANCY
    return {
        a, b, op, mask, sign, result,
        key: `${a}_${b}_${op}_${mask}`, //生成算式的key，方便数据库处理，并能很方便地还原为formula对象
        formulaArray, maskedArray,
        answer: formulaArray[mask]
    }
}


//平凡的算式指那些无需计算的算式，实践中应当过滤掉。
function isTrivial(fma) {
    if(fma.a === 0 || fma.a === 1 || fma.b === 0 || fma.b === 1)
        return true;
    if((fma.op === 'sub' || fma.op === 'div') && fma.a === fma.b)
        return true;
    return false;
}

function random_formulas_in_scope(arithScope, count, operator = 'add') {
    return times(count*2, function() {
        var maxscope = range(2, arithScope);
        var ascope = range(2,arithScope);
        return random_formula(operator, maxscope, ascope);
    }).filter(function(formula) {
        return !isTrivial(formula)
    }).slice(0,count);
}

/**随机生成结果不超过指定范围的算式。
*返回生成该随机算式的函数。
*maxscope为算式中最大数的取值范围，类型为数组。不同运算法则中max的位置是不同的。
*ascope为算式中某个数的取值范围，类型为数组。
**/
function random_formula(op, maxscope, ascope) {
    var m = sample(maxscope);
    //在算式中确定一个数后，另一个数的取值也会受取限制
    if(op === 'add' || op === 'sub') {
        ascope = ascope.filter(value => value < m);
    }
    //如果是乘除法，要过滤掉不能被整除的数。
    if(op === 'div' || op === 'mul') {
        ascope = ascope.filter(value => m % value === 0);
    }
    //必须考虑ascope的长度为0的情况。
    var a = ascope.length > 0 ? sample(ascope) : m;
    if(op === 'add' || op === 'mul') {
        var o = cal_other(op, m, a);
        return formula(a, o, op);
    } else {
        return formula(m, a, op);
    }
}
/**
* 根据算式中最大数与其中一个数，算出另一个数。
**/
function cal_other(op, max, a) {
    if(op === 'add' || op === 'sub') {
        return max - a;
    }
    if(op === 'mul' || op === 'div') {
        if(max % a !== 0) {
            throw new Error(`${max} cannot divide exactly by ${a}.`);
        }
        return max / a;
    }
}

module.exports = {
    formula,
    random_formulas_in_scope,
    random_formula
};
