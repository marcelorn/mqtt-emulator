const chai = require('chai');
chai.use(require('chai-fs'));
const { expect, assert } = chai;
global._debug = false;
global._save = false;
const generate = require('../../app/utils');
const appRoot = require('app-root-path');
const exec = require('child_process').exec

describe('GenerateData', () => {
    describe('#save()', () => {
        it('should save results on /tmp-test', () => {
            global._save = true;
            global._tmpFolder = `${appRoot.path}/tmp-test`;
            utils.save({ foo: 'bar' }).then((path) => {
                expect(path).to.be.a.file().with.json;                
            }).then(() => {
                exec(`rm -r  ${global._tmpFolder}`);
            });
        });
        before(() => {
            global._save = false;
        })
    });
    describe('#interpolate()', () => {
        it('should return interpolated array with the same amount of values', () => {
            const values = [
                { name: 'temperature', values: ['t1', 't2', 't3'] },
                { name: 'portaAberta', values: ['p1', 'p2', 'p3'] },
                { name: 'defeito', values: ['d1', 'd2', 'd3'] }
            ]
            const result = generateData._interpolate(values);
            expect(result).to.eql([
                { temperature: 't1', portaAberta: 'p1', defeito: 'd1' },
                { temperature: 't2', portaAberta: 'p2', defeito: 'd2' },
                { temperature: 't3', portaAberta: 'p3', defeito: 'd3' }
            ]);
        });
        it('should return interpolated array with diferent amount of values', () => {
            const values = [
                { name: 'temperature', values: ['t1', 't2'] },
                { name: 'portaAberta', values: ['p1', 'p2', 'p3'] },
                { name: 'defeito', values: ['d1', 'd2'] }
            ]
            const result = utils.interpolate(values);
            expect(result).to.eql([
                { temperature: 't1', portaAberta: 'p1', defeito: 'd1' },
                { temperature: 't2', portaAberta: 'p2', defeito: 'd2' },
                { portaAberta: 'p3' }
            ]);
        });
    });
});