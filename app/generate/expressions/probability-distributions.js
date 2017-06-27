const PD = require('probability-distributions');
const ganerateUtils = require('../utils');
const DISTRIBUTIONS = require('./expressions-types').probabilityDistributions;

_calcGauss = (amount, values) => {
    const [mean, std] = values;
    return PD.rnorm(amount, mean, std);
}

_calcBinomial = (amount, values) => {
    const [numberOfEvents, probability] = values;
    return PD.rbinom(amount, numberOfEvents, probability);
}

_calcUniform = (amount, values) => {
    const [min, max] = values;
    return PD.runif(amount, min, max);
}

_calcPoisson = (amount, values) => {
    const [variance] = values;
    return PD.rpois(amount, variance);
}

run = (config, sensor) => {

    const sensorResult = {
        name: sensor.name,
        expression: sensor.value,
        values: []
    }

    return new Promise((resolve, reject) => {
        const initDate = new Date();

        switch (sensor.expression) {
            case DISTRIBUTIONS.NORMAL:
            case DISTRIBUTIONS.GAUSS: {
                sensorResult.values = _calcGauss(config.device.amount, sensor.expressionValues);
                ganerateUtils.logExpression(sensor, initDate);
                resolve(sensorResult);
                break;
            }
            case DISTRIBUTIONS.BINOMIAL: {
                sensorResult.values = _calcBinomial(config.device.amount, sensor.expressionValues);
                ganerateUtils.logExpression(sensor, initDate);
                resolve(sensorResult);
                break;
            }
            case DISTRIBUTIONS.UNIFORM: {
                sensorResult.values = _calcUniform(config.device.amount, sensor.expressionValues);
                ganerateUtils.logExpression(sensor, initDate);
                resolve(sensorResult);
                break;
            }
            case DISTRIBUTIONS.POISSON: {
                sensorResult.values = _calcPoisson(config.device.amount, sensor.expressionValues);
                ganerateUtils.logExpression(sensor, initDate);
                resolve(sensorResult);
                break;
            }
            default: {
                reject(`There's no function implementation for ${sensor.expression}`);
                break;
            }
        }

    });
}

module.exports = {
    _calcGauss,
    _calcBinomial,
    _calcUniform,
    _calcPoisson,    
    run
}