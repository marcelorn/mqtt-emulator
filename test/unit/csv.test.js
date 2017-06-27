const expect = require('chai').expect;
const csv = require('../../app/csv');
const appRoot = require('app-root-path');

describe('CSV Reader', () => {
    describe('#read()', () => {
        it('should return ["20", "22", "23", "19"] of given resources/data.csv and column 2', () => {
            return csv(`${appRoot}/test/resources/data.csv`, { noheader: true }).then(result => {
                expect(result).to.eql([['3000', '18'], ['4000', '18.5'], ['700', '19'], ['3000', '19.5'], ['1000', '20']]);
            });
        });
    });
});