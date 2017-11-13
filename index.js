var shuffle = require('lodash/shuffle')
var arith = require('./arith.js')
var mtable = require('./table').mtable

//从key还原回BinaryFormula对象。
function from(key){
    var values = key.split('_');
    if(values.length !== 4) {
        throw new Error('wrong parameter key: ' + key + '.');
    }
    return arith.formula(
        Number.parseInt(values[0], 10),
        Number.parseInt(values[1], 10),
        values[2],
        Number.parseInt(values[3], 10)
    )
}

/**
* 指定范围内的乘法口诀表，参数可以是一个整数，也可以是两个元素的数组，数组的第0个元素为起始值，
* 数组的第1个元素为结束值（包含结束值）。
**/
function mul_table(scope) {
    if(typeof scope === 'number') {
        return mtable(2, scope)
    }
    if(scope instanceof Array && scope.length === 2) {
        return mtable(scope[0], scope[1])
    }
}

//根据config配置对象生成算式
function generate_formulas(config) {
    //如果有mulscope参数，则直接生成乘法口诀表。
    if(config.mulscope) {
        return mul_table(config.mulscope)
    }
    //每个运算法则平均分配到的算式数量。
    var opcount = Math.ceil(config.count / config.operators.length) + 1
    var formulas = [];
    //指定了最大值范围的情形。
    if (config.maxscope) {
        config.operators.forEach(function(op) {
            var arr = arith.random_formulas_in_scope(config.maxscope, opcount, op)
            formulas = formulas.concat(arr)
        });
    }
    //生成的算式数量可能会超出count的范围，只取指定数量的算式。
    return shuffle(formulas).slice(0, config.count)
}

function rand(scope) {
    return function(operator) {
        return function(count) {
            return arith.random_formulas_in_scope(scope, count, operator)
        }
    }
}

module.exports = {
    formula: arith.formula,
    from: from,
    rand: rand,
    generate: generate_formulas
}
