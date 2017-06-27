const { setup } = require('./setup');
const generate = require('./generate');
const utils = require('./utils');
const publisher = require('./publishers/mqtt');

module.exports = args => {
    try {
        setup(args)
            .then(config => {
                generate(config)
                    .then(sensors => publisher(config, sensors))
                    .catch(err => utils.log('error', err));
            }).catch(err => utils.log('error', err));
    } catch (err) {
        utils.log('error', err);
    }
}