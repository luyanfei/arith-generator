/**
 * 组建训练的内容。
 */
const range = require('lodash/range')
const sample = require('lodash/sample')
const shuffle = require('lodash/shuffle')
const times = require('lodash/times')
const {formula, isTrivial} = require('./arithmetic.js')

function random_formulas_in_scope(arithScope, count, operator = 'add') {
    return times(count*2, function() {
        var maxscope = range(2, arithScope);
        var ascope = range(2,arithScope);
        return random_formula(operator, maxscope, ascope);
    }).filter((formula) => !isTrivial(formula)).slice(0,count);
}

function rand(scope) {
    return function (operator) {
        return function (count) {
            return random_formulas_in_scope(scope, count, operator);
        };
    };
}
/**随机生成结果不超过指定范围的算式。
*返回生成该随机算式的函数。
*maxscope为算式中最大数的取值范围，类型为数组。
*ascope为算式中某个数的取值范围，类型为数组。
**/
function random_formula(op, maxscope, ascope) {
    var m = sample(maxscope);
    //在算式中确定一个数后，另一个数的取值也会受取限制
    if(op === 'add' || op === 'sub') {
        ascope = ascope.filter((value) => value < m);
    }
    //如果是乘除法，要过滤掉不能被整除的数。
    if(op === 'div' || op === 'mul') {
        ascope = ascope.filter((value) => m % value === 0);
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
/**
* 指定范围内的乘法口诀表
**/
function multiplication_table(scope = 9) {
    if(scope <= 1 || scope > 9) {
        throw new Error('Wrong scope for multiplication_table: ' + scope);
    }
    var table = [];
    for(let i = 2; i <= scope; i++) {
        for(let j = 2; j <= 9; j++) {
            table.push(formula(i, j, 'mul'));
        }
    }
    return shuffle(table);
}

//根据arith配置对象生成算式
function generate_formulas(arith) {
    //如果有mulscope参数，则直接生成乘法口诀表。
    if(arith.mulscope) {
        return multiplication_table(arith.mulscope);
    }
    //每个运算法则平均分配到的算式数量。
    var opcount = Math.ceil(arith.count / arith.operators.length);
    var formulas = [];
    //指定了最大值范围的情形。
    if (arith.maxscope) {
        arith.operators.forEach((op) => {
            var arr = random_formulas_in_scope(arith.maxscope, opcount, op);
            formulas.push(...arr);
        });
    }
    //生成的算式数量可能会超出count的范围，只取指数量的算式。
    return shuffle(formulas).slice(0, arith.count);
}

module.exports = {
    random_formulas_in_scope,
    random_formula,
    multiplication_table,
    generate_formulas,
    cal_other,
    rand
};
