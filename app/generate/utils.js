const mkdirp = require('mkdirp');
const fs = require('fs');
const _max = require('lodash.max');

const utils = require('../utils');


save = result => {
    return new Promise((resolve, reject) => {
        if (global._save && global._tmpFolder) {
            mkdirp(global._tmpFolder, err => {
                if (err) {
                    utils.log('error', err);
                    return;
                }
                const filePath = `${global._tmpFolder}/${new Date().getTime()}.json`;
                fs.writeFile(filePath, JSON.stringify(result), err => {
                    if (err) {
                        utils.log('error', err);
                        reject(err);
                        return;
                    }
                    utils.log('log', `File ${filePath} has been created.`);
                    resolve(filePath);
                });
            });
        }
        resolve();
    });
}

interpolate = results => {
    const payloadResult = [];
    const limit = _max(results.map(result => { return result.values.length }));
    for (let i = 0; i < limit; i++) {
        let payload = {};
        for (let j = 0; j < results.length; j++) {
            if (results[j].values[i] !== undefined && results[j].values[i] !== null) {
                if(typeof results[j].values[i] === 'object'){
                    payload[results[j].name] = Object.assign({}, results[j].values[i], payload[results[j].name]);                    
                }else{
                    payload[results[j].name] = results[j].values[i];
                }
            }
        }
        payloadResult.push(payload);
    }
    return payloadResult;
}

addEventInterval = (config, sensors) => {
    if (config.device.eventIntervals.length) {
        for (let i = 0; i < config.device.eventIntervals.length; i++) {
            const eventInterval = config.device.eventIntervals[i];
            sensors[i].__eventInterval = eventInterval;
        }
    } else {
        sensors.forEach(sensor => {
            sensor.__eventInterval = config.device.frequency;
        });
    }
    return sensors;
}

logExpression = (sensor, initDate) => {
    utils.log('log', `Expression ${sensor.expression}(${sensor.expressionValues}) executed for sensor '${sensor.name}' - ${new Date().getTime() - initDate.getTime()}ms.`);
}

module.exports = {
    save,
    interpolate,
    addEventInterval,
    logExpression
}

