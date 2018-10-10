const ganerateUtils = require('../utils');
const util = require("util");

module.exports = (config, sensor) => {

    const values = sensor.expressionValues.match(/^\[(.*)\]/)[1].split(",");
    const sensorResult = {
        name: sensor.name,
        expression: sensor.value,
        values: []
    }

    return new Promise((resolve, reject) => {
        for(let i = 0; i < config.device.amount; i++) {
            sensorResult.values.push(values[i % values.length]);
        }
        resolve(sensorResult);
    });
}