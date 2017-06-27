const utils = require('./utils');

module.exports = (config, sensors, publishFunction, afterPublishFunction) => {

    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function scheduler(config, sensors, publishFunction, afterPublishFunction) {
        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            utils.log('time', 'time');
            await sleep(sensor.__eventInterval / config.accelerate).then(() => {
                publishFunction(sensor);
            });
            utils.log('timeEnd', 'time');
        }
        afterPublishFunction();
    }

    scheduler(config, sensors, publishFunction, afterPublishFunction);
};