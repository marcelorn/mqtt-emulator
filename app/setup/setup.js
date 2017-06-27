const fs = require('fs');
const appRoot = require('app-root-path');

const utils = require('../utils');
const validator = require('../validations/validator');
const eventInterval = require('./event-interval');
const device = require('./device');

module.exports = args => {
    return new Promise((resolve, reject) => {
        const { configFile, debug, save, distributionsFile } = args;
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const result = validator.schema(config);
        if (result === true) {
            global._debug = debug;
            global._save = save;
            global._tmpFolder = `${appRoot.path}/tmp`;

            config.csvMap = new Map();

            if (config.device) {
                device(config)
                    .then(eventInterval)
                    .then(config => {
                        if (distributionsFile) {
                            config.distributionsFile = distributionsFile;
                            config.generationType = 'file';
                        }
                        resolve(config);
                    });
            } else if (config.csv) {
                config.generationType = 'csv';
                config.accelerate = config.csv.accelerate;
                resolve(config);
            }
        } else {
            reject(result.map(error => {
                return `dataPath: ${error.dataPath}. message: ${error.message}`
            }));
        }
    });
}