const mqtt = require('mqtt');

const scheduler = require('../scheduler');
const utils = require('../utils');

module.exports = (config, sensors) => {

    const mqttConfig = config.protocol.mqtt;
    const client = mqtt.connect(`mqtt://${mqttConfig.serverAddress}:${mqttConfig.port}`);

    client.on('connect', () => {
        scheduler(config, sensors, _publish, _afterPublish);
    });

    _publish = payload => {
        delete payload.__eventInterval;
        delete payload.__timestamp;
        const payloadJson = JSON.stringify(utils.convertAllAttToString(payload));
        client.publish(mqttConfig.topic, payloadJson);
        utils.log('log', `Published ${payloadJson}`);
    }

    _afterPublish = () => {
        client.end();
        console.log('Done.');
    }
    
} 