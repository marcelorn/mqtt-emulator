const { expect, assert } = require('chai');
global.debug = false;
const probabilityDistributions = require('../../app/probability-distributions');
const appRoot = require('app-root-path');
const sinon = require('sinon');

describe('ProbabilityDistributions', () => {
    describe('#parseExpression()', () => {
        it('should return NORMAL and 10.0,20.0 of given NORMAL(10.0,20.0)', () => {
            const valuesMatch = probabilityDistributions.parseExpression('NORMAL(10.0,20.0)');
            expect(valuesMatch[1]).to.be.equal('NORMAL');
            expect(valuesMatch[2]).to.be.equal('10.0,20.0');
        });
        it('should return UNIFORM and 120,135 of given UNIFORM(120,135)', () => {
            const valuesMatch = probabilityDistributions.parseExpression('UNIFORM(120,135)');
            expect(valuesMatch[1]).to.be.equal('UNIFORM');
            expect(valuesMatch[2]).to.be.equal('120,135');
        });
        it('should return FILE and data.csv:2 of given FILE(/tmp/data.csv:2)', () => {
            const valuesMatch = probabilityDistributions.parseExpression('FILE(/tmp/data.csv:2)');
            expect(valuesMatch[1]).to.be.equal('FILE');
            expect(valuesMatch[2]).to.be.equal('/tmp/data.csv:2');
        });
    });

    describe('#run()', () => {
        it('should run NORMAL', () => {
            probabilityDistributions.run({ name: 'temperatura', value: 'NORMAL(100,20)' }, { frequency: 1, duration: 10000 })
                .then(result => {
                    expect(result.name).to.be.equal('temperatura');
                    assert.isArray(result.values);
                    assert.lengthOf(result.values, 10000);
                }).catch(msg => {
                    console.error(msg);
                });
        });
        it('should run BINOMIAL', () => {
            probabilityDistributions.run({ name: 'temperatura', value: 'BINOMIAL(10,0.5)' }, { frequency: 300000, duration: 1800000 })
                .then(result => {
                    expect(result.name).to.be.equal('temperatura');
                    assert.isArray(result.values);
                    assert.lengthOf(result.values, 6);
                }).catch(msg => {
                    console.error(msg);
                });
        });
        it('should run UNIFORM', () => {
            probabilityDistributions.run({ name: 'temperatura', value: 'UNIFORM(10,30)' }, { frequency: 300000, duration: 1800000 })
                .then(result => {
                    expect(result.name).to.be.equal('temperatura');
                    assert.isArray(result.values);
                    assert.lengthOf(result.values, 6);
                }).catch(msg => {
                    console.error(msg);
                });
        });
        it('should run POISSON', () => {
            probabilityDistributions.run({ name: 'temperatura', value: 'POISSON(10)' }, { frequency: 300000, duration: 1800000 })
                .then(result => {
                    expect(result.name).to.be.equal('temperatura');
                    assert.isArray(result.values);
                    assert.lengthOf(result.values, 6);
                }).catch(msg => {
                    console.error(msg);
                });
        });
    });

});