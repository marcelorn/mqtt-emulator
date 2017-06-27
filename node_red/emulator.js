const { setup, eventInterval } = require('../app/setup');
const generate = require('../app/generate');
const ganerateUtils = require('../app/generate/utils');
const scheduler = require('../app/scheduler');
const utils = require('../app/utils');

run = (node, config) => {

    node.status({ fill: "blue", shape: "dot", text: "emulating" });
    setup.device(config)
        .then(eventInterval)
        .then(generate)
        .then(sensors => {
            sensors = ganerateUtils.addEventInterval(config, sensors);
            let index = 0;
            const publishFunction = () => {
                if (sensors[index]) {
                    const payload = JSON.stringify(utils.convertAllAttToString(sensors[index]));
                    node.send({ payload });
                    index++;
                }
            }

            const afterPublishFunction = () => {
                if (sensors.length === index) {
                    node.status({ fill: "green", shape: "ring", text: "idle" });
                }
            }

            scheduler(config, sensors, publishFunction, afterPublishFunction);
        });

}

module.exports = function (RED) {
    function emulate(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.status({ fill: "green", shape: "ring", text: "idle" });
        config.frequency = parseInt(config.frequency);
        config.duration = parseInt(config.duration);

        const emulatorConfig = {
            generationType: 'distribution',
            schedulerType: 'frequency',
            device: {
                frequency: config.frequency,
                duration: config.duration,
                amount: config.duration / config.frequency,
                sensors: config.sensors.map(sensor => {
                    return { name: sensor.type, value: sensor.value }
                })
            }
        };

        run(node, emulatorConfig);
    }
    RED.nodes.registerType("emulate", emulate);
}