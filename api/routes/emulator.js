const { Router } = require('express');
const router = Router();
const generate = require('../../app/generate');
const utils = require('../../app/utils');
const publisher = require('../../app/publishers/mqtt');


var emulator = {};
emulator.cancel = function(){};

router.get('/', (req, res) => {
  return res.status(200).send({'success': true, 'message': 'Emulator endpoint'});
});

router.post('/start', (req, res) => {
  var config = Object.assign({}, req.app.get('config'));
  console.log(`Received message: ${JSON.stringify(req.body)}`);
  for (var prop in req.body) {
    config[prop] = req.body[prop];
  }
  config.csvMap = new Map();
  console.log(`Merged config (${req.body.device.id}): ${JSON.stringify(config)}`);
  generate(config)
    .then(sensors => {
      publisher.autoPublish(config, sensors, emulator);
    })
    .catch(err => utils.log('error', err));
  return res.status(200).send({'success': true, 'message': 'Emulator has started!'});
});

router.post('/stop', (req, res) => {
  const deviceId = req.body.deviceId;
  console.log(`Stop emulator for device Id ${deviceId}`);
  emulator.cancel(deviceId);
  return res.status(200).send({'success': true, 'message': 'Emulator has stopped!'});
});

module.exports = router;