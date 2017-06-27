const ganerateUtils = require('./utils');
const { expressions, probabilityDistributions } = require('./expressions/expressions-types');
const pd = require('./expressions/probability-distributions');
const csvColumnReader = require('./expressions/csv-column-reader');
const mapsDirections = require('./expressions/maps-diretions');

module.exports = (config) => {

    generate = config => {
        return new Promise((resolve, reject) => {
            const promiseResults = [];

            config.device.sensors.forEach(sensor => {
                if (Object.values(probabilityDistributions).indexOf(sensor.expression) >= 0) {
                    promiseResults.push(pd.run(config, sensor));
                } else if (sensor.expression === expressions.FILE) {
                    promiseResults.push(csvColumnReader(config, sensor));
                } else if (sensor.expression === expressions.ROUTE) {
                    promiseResults.push(mapsDirections(config, sensor));
                }
            });

            Promise.all(promiseResults)
                .then(sensorsGroupedByName => {
                    ganerateUtils.save(sensorsGroupedByName)
                        .then(() => {
                            let sensors = ganerateUtils.interpolate(sensorsGroupedByName);
                            sensors = ganerateUtils.addEventInterval(config, sensors);
                            resolve(sensors);
                        });
                }).catch(err => {
                    reject(err);
                });
        });
    }

    return generate(config);

};


