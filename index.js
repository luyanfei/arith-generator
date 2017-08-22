var shuffle = require('lodash/shuffle')
var arith = require('./arith.js')
//从key还原回BinaryFormula对象。
function from(key){
    var values = key.split('_');
    if(values.length !== 4) {
        throw new Error(`wrong parameter key: ${key}`);
    }
    return arith.formula(
        Number.parseInt(values[0], 10),
        Number.parseInt(values[1], 10),
        values[2],
        Number.parseInt(values[3], 10)
    )
}

/**
* 指定范围内的乘法口诀表
**/
function mul_table(scope = 9) {
    if(scope <= 1 || scope > 9) {
        throw new Error('Wrong scope for multiplication_table: ' + scope);
    }
    var table = []; var i,j;
    for(i = 2; i <= scope; i++) {
        for(j = 2; j <= 9; j++) {
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
        arith.operators.forEach(op => {
            var arr = arith.random_formulas_in_scope(arith.maxscope, opcount, op);
            formulas.push(...arr);
        });
    }
    //生成的算式数量可能会超出count的范围，只取指数量的算式。
    return shuffle(formulas).slice(0, arith.count);
}

function rand(scope) {
    return function(operator) {
        return function(count) {
            return arith.random_formulas_in_scope(scope, count, operator)
        }
    }
}

module.exports = {formula: arith.formula, from: from, rand: rand}
