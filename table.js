var formula = require('./arith').formula

//generate mul formula from start(included) to end(included)
function mtable(start, end) {
    var table = [];
    for(var i = start; i <= end; i++) {
        for(var j = i; j <= end; j++) {
            table.push(formula(i, j, 'mul'))
        }
    }
    return table
}

module.exports = {mtable: mtable}
