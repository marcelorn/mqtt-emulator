const ganerateUtils = require('../utils');

module.exports = (config, sensor) => {

    if(!config.maps){
        throw new Error('Property "maps" must to be setted on configuration.json.');
    }    

    const googleMapsClient = require('@google/maps').createClient({
        key: config.maps.key
    });

    const origin = sensor.expressionValues[0];
    const destination = sensor.expressionValues[1];

    const sensorResult = {
        name: sensor.name,
        expression: sensor.value,
        values: []
    }

    const initDate = new Date();

    return new Promise((resolve, reject) => {
        ganerateUtils.logExpression(sensor, initDate);
        googleMapsClient.directions({
            origin,
            destination,
            mode: 'driving',
        }, (err, response) => {
            if (!err) {
                sensorResult.values = response.json.routes[0].legs[0].steps.map(step => { 
                    return `${step.start_location.lat},${step.start_location.lng}` 
                });
                resolve(sensorResult);
            }
            reject(err);
        });
    });
}