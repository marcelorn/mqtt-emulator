const jsonFile = require('jsonfile');

const utils = require('../utils');
const generateUtils = require('./utils');

module.exports = config => {

    generate = config => {
        utils.log('log', `Resending data from the '${config.distributionsFile}' file.`);
        return new Promise((resolve, reject) => {
            jsonFile.readFile(config.distributionsFile, (err, sensorsGroupedByName) => {
                if (err) {
                    reject(err);
                } else {
                    let sensors = generateUtils.interpolate(sensorsGroupedByName);
                    sensors = generateUtils.addEventInterval(config, sensors);
                    resolve(sensors);
                }
            });
        });
    }

    return generate(config);

};