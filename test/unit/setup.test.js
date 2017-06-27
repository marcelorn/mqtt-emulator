const chai = require('chai')
const { expect, assert } = chai;
const appRoot = require('app-root-path');
const fs = require('fs');

const setup = require('../../app/setup');

describe('Setup', () => {
    describe('#config()', () => {
        it('should return a config', (done) => {
            setup.config({
                configFile: `${appRoot.path}/test/resources/config.json`,
                debug: false,
                show: false
            }).then(config => {
                expect(config).to.exist;
                expect(config.protocol).to.exist;
                expect(config.protocol.mqtt).to.exist;
                expect(config.protocol.mqtt.serverAddress).to.be.equal('10.101.47.51');
                expect(config.protocol.mqtt.port).to.be.equal(1883);
                expect(config.protocol.mqtt.topic).to.be.equal('/AAFF9977/s013/attrs');

                done();
            }).catch(err => {
                done(err);
            });;
        });

        it('should return a config with csv configuration', (done) => {
            setup.config({
                configFile: `${appRoot.path}/test/resources/config3.json`,
                debug: false,
                show: false
            }).then(config => {
                expect(config).to.exist;
                expect(config.protocol).to.exist;
                expect(config.protocol.mqtt).to.exist;
                expect(config.protocol.mqtt.serverAddress).to.be.equal('10.101.47.51');
                expect(config.protocol.mqtt.port).to.be.equal(1883);
                expect(config.protocol.mqtt.topic).to.be.equal('/AAFF9977/s012/attrs');

                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should return a device config', (done) => {
            setup.config({
                configFile: `${appRoot.path}/test/resources/config.json`,
                debug: false,
                show: false
            }).then(config => {

                expect(config.device).to.exist;
                expect(config.device.frequency).to.be.equal(100);
                expect(config.device.duration).to.be.equal(50000);
                expect(config.device.accelerate).to.be.equal(1);

                expect(config.device.sensors).to.exist;
                expect(config.device.sensors.length).to.be.equal(2);
                expect(config.device.sensors[0].name).to.be.equal('temperatura');
                expect(config.device.sensors[0].value).to.be.equal('NORMAL(23,3)');
                expect(config.device.sensors[1].name).to.be.equal('tensao');
                expect(config.device.sensors[1].value).to.be.equal('UNIFORM(120,135)');

                expect(config.device.amount).to.be.equal(500);
                done();
            }).catch(err => {
                done(err);
            });;
        });
    });
});