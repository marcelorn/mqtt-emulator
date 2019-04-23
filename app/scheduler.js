const utils = require('./utils');

module.exports = (config, sensors, publishFunction, afterPublishFunction, running) => {

    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function scheduler(config, sensors, publishFunction, afterPublishFunction, running) {
        var keepRunning = true;
        running.cancel = function() {
            keepRunning = false;
        };

        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            utils.log('time', 'time');
            await sleep(sensor.__eventInterval / config.accelerate).then(() => {
                publishFunction(sensor);
            });
            utils.log('timeEnd', 'time');
            if (!keepRunning) {
                break;
            }
        }
        afterPublishFunction();
    }

    scheduler(config, sensors, publishFunction, afterPublishFunction, running);
};