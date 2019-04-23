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
  utils.log('error', JSON.stringify(req.body));
  const config = req.body;
  generate(config)
    .then(sensors => publisher.autoPublish(config, sensors, emulator))
    .catch(err => utils.log('error', err));
  return res.status(200).send({'success': true, 'message': 'Emulator has started!'});
});

router.post('/stop', (req, res) => {
  emulator.cancel();
  return res.status(200).send({'success': true, 'message': 'Emulator has stopped!'});
});

module.exports = router;