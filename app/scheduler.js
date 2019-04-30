const utils = require('./utils');

let keepRunning = {};
let autoRestart = {};

module.exports = (config, sensors, publishFunction, afterPublishFunction, running) => {

    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function scheduler(config, sensors, publishFunction, afterPublishFunction, running) {
        keepRunning[config.device.id] = true;
        autoRestart[config.device.id] = Boolean(config.device.autoRestart);

        running.cancel = function(id) {
            if (keepRunning.hasOwnProperty([id])) {
                console.log(`Device Simulation (${id}) has been terminated!`);
                keepRunning[id] = false;
            } else {
                console.log(`Ignored: Device Simulation (${id}) is not running!`);
            }
        };

        var i = 0;
        do {
            const sensor = sensors[i];
            utils.log('time', 'time');
            await sleep(config.device.frequency / config.accelerate).then(() => {
                publishFunction(sensor);
            });
            utils.log('timeEnd', 'time');
            i = i + 1;
            if (autoRestart[config.device.id] && i >= sensors.length) {
                i = 0;
            }
        } while ((i < sensors.length) && keepRunning[config.device.id]);
        delete keepRunning[config.device.id];
        delete autoRestart[config.device.id];
        afterPublishFunction();
    }

    scheduler(config, sensors, publishFunction, afterPublishFunction, running);
};