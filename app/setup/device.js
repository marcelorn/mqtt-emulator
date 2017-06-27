const utils = require('../utils');
const EXPRESSIONS = require('../generate/expressions/expressions-types').expressions;
const validator = require('../validations/validator');

module.exports = config => {

    return new Promise((resolve, reject) => {
        const device = config.device;

        config.generationType = 'expression';
        config.accelerate = device.accelerate ? device.accelerate : 1;

        device.eventIntervals = [];
        device.amount = 0;

        device.sensors.forEach(sensor => {

            const valueMatch = utils.parseExpression(sensor.value);
            const expression = valueMatch[1].toLowerCase();
            validator.sensor.expression(sensor, expression);

            const params = valueMatch[2];
            let values;
            if (expression === EXPRESSIONS.ROUTE) {
                const pattern = /([0-9.-]+).+?([0-9.-]+)/g;
                const matches = [];
                while ((values = pattern.exec(params)) !== null) {
                    matches.push([values[1],values[2]]);
                }
                values = matches;
            } else {
                values = params.split(',');
                if (expression !== EXPRESSIONS.FILE) {
                    values = values.map(value => { return parseFloat(value) });
                } else {
                    values = values[0].split(':');
                }
            }
            sensor.expression = expression;
            sensor.expressionValues = values;

        });
        resolve(config);
    });

}