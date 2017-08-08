const {expect} = require('chai')
const {random_formula, random_formulas_in_scope} = require('../index.js')

describe('arith-generator test', function() {
    it('test random_formula', function() {
        let marr = [40, 50, 60]
        let arr = [10, 20, 30]
        let f = random_formula('sub', marr, arr)
        expect(f.a).to.be.oneOf(marr)
        expect(f.sign).equal('-')
        expect(f.formulaArray.length).equal(5)
        // console.log(f)
    })

    it('test random_formulas_in_scope', function() {
        let formulas = random_formulas_in_scope(100, 40, 'sub')
        expect(formulas.length).equal(40)
        formulas.forEach(f => {
            expect(f.a).below(100)
        })
    })
})