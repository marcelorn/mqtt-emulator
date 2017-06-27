const csv = require('../../csv');
const utils = require('../../utils');
const ganerateUtils = require('../utils');


module.exports = (config, sensor) => {

    _fromFile = (config, values) => {
        return new Promise((resolve, reject) => {
            let [filePath, column] = values;
            const isColumnNumber = utils.isNumber(column);
            if (config.csvMap.get(filePath)) {
                const result = config.csvMap.get(filePath).map(item => {
                    return item[isColumnNumber ? parseInt(column) - 1 : column];
                });
                resolve(result);
            } else {
                csv(filePath, { noheader: isColumnNumber }).then(csvResult => {
                    config.csvMap.set(filePath, csvResult);
                    const result = csvResult.map(item => {
                        return item[isColumnNumber ? parseInt(column) - 1 : column];
                    });
                    resolve(result);
                });
            }
        });
    }

    return new Promise((resolve, reject) => {

        const sensorResult = {
            name: sensor.name,
            expression: sensor.value,
            values: []
        }

        const initDate = new Date();

        _fromFile(config, sensor.expressionValues).then(result => {
            sensorResult.values = result;
            ganerateUtils.logExpression(sensor, initDate);
            resolve(sensorResult);
        }).catch(err=>{
            reject(err);
        });
    });

}