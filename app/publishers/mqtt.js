const mqtt = require('mqtt');

const scheduler = require('../scheduler');
const utils = require('../utils');
var fs = require('fs');

module.exports = (config, sensors) => {

    const mqttConfig = config.protocol.mqtt;

    var options = {
        keepalive: 0,
        connectTimeout: 60 * 60 * 1000
    };

    if (mqttConfig.username && mqttConfig.password) {
        options.username = mqttConfig.username;
        options.password = mqttConfig.password;
    }

    let protocol = '';
    if ((mqttConfig.secure != undefined) && (mqttConfig.secure == true)) {
      // Read TLS configuration
      options.key = fs.readFileSync(mqttConfig.tls.key, 'utf8');
      options.cert = fs.readFileSync(mqttConfig.tls.cert, 'utf8');
      options.ca = [];
      for (var i = 0; i < mqttConfig.tls.ca.length; i++) {
        options.ca.push(fs.readFileSync(mqttConfig.tls.ca[i].name, 'utf8'));
      }

      options.passphrase = mqttConfig.passphrase;
      //options.secureProtocol = 'TLSv1_2_method';
      options.port = 8883;
      options.protocol = 'mqtts';
      options.protocolId = 'MQIsdp';
      options.protocolVersion = 3;

      protocol = 'mqtts://';
    } else {
      protocol = 'mqtt://';
    }

    const client = mqtt.connect(protocol + mqttConfig.serverAddress + ':' + mqttConfig.port, options);

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
