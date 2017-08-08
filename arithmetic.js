//算式中需要填充的数值用VACANCY来替换
const VACANCY = '□';
const OPERATORS = ['add', 'sub', 'mul', 'div'];

//op table
const opt = {
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
const formula = (a, b, op='add', mask=4) => {
    let sign = opt[op].sym
    let result = opt[op].func(a, b)
    //数组形式
    let formulaArray = [a, sign, b, '=', result]
    //掩掉填充位的数组形式
    let maskedArray = formulaArray.slice(0)
    maskedArray[mask] = VACANCY
    return {
        a, b, op, mask, sign, result,
        key: `${a}_${b}_${op}_${mask}`, //生成算式的key，方便数据库处理，并能很方便地还原为formula对象
        formulaArray, maskedArray,
        answer: formulaArray[mask]
    }
}

//平凡的算式指那些无需计算的算式，实践中应当过滤掉。
const isTrivial = fma => {
    if(fma.a === 0 || fma.a === 1 || fma.b === 0 || fma.b === 1)
        return true;
    if((fma.op === 'sub' || fma.op === 'div') && fma.a === fma.b)
        return true;
    return false;
}

//从key还原回BinaryFormula对象。
const from = key => {
    var values = key.split('_');
    if(values.length !== 4) {
        throw new Error(`wrong parameter key: ${key}`);
    }
    return formula(
        Number.parseInt(values[0], 10),
        Number.parseInt(values[1], 10),
        values[2],
        Number.parseInt(values[3], 10)
    )
}

module.exports = {VACANCY, OPERATORS, formula, from, isTrivial}
