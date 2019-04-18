const { Router } = require('express');
const router = Router();
const publisher = require('../../app/publishers/mqtt');

router.get('/', (req, res) => {
  return res.status(200).send({'success': true});
});

router.post('/publish', (req, res) => {
    var mqttConfig = {};
    console.log(`Received message: topic=${req.body.topic} data=${JSON.stringify(req.body.data)}`);
    publisher.publish(mqttConfig, req.body.topic, req.body.data);
    return res.status(200).send({'success': true});
});

module.exports = router;