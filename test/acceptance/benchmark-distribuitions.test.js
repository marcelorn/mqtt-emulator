const { expect, assert } = require('chai');
global.debug = false;
const probabilityDistributions = require('../../app/probability-distributions');
const appRoot = require('app-root-path');

function random(start, end) {
    return Math.floor(Math.random() * end) + start;
}

async function run(mean, std) {
    return await probabilityDistributions.run({ name: 'temperatura', value: `NORMAL(${mean},${std})` }, { frequency: 1, duration: 10000 });
}

describe('Benchmark distribuitions times', () => {
    describe('#run()', () => {

        it('should run NORMAL', () => {
            const resultsTime = [];
            const amount = 20;

            for (let i = 0; i < amount; i++) {
                const mean = random(0, 200);
                const std = random(0, 20);
                const init = new Date();
                run(mean, std);
                const end = new Date().getTime() - init.getTime();
                resultsTime.push(end);
            }

            console.log('\tMean', resultsTime.reduce((a, b) => a + b, 0) / amount)

        });
    });
});