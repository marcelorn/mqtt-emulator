const chai = require('chai')
const { expect, assert } = chai;

const validador = require('../../app/validations/validator');

describe('Schema', () => {
    describe('#schema()', () => {
        it('should validate the object using the schema', (done) => {

            const configInput = {
                "protocol": {
                    "mqtt": {
                        "serverAddress": "10.101.47.12",
                        "port": 1883,
                        "topic": "/AAFF9977/s001/attrs"
                    }
                },
                "device": {
                    //"frequency": 'FILE(test/resources/data.csv:1)',
                    "frequency": 10000,
                    "duration": 5000,
                    "accelerate": 1,
                    "sensors": [
                        { "name": "temperature", "value": "NORMAL(23,3)" },
                        { "name": "voltage", "value": "UNIFORM(120, 135)" },
                        { "name": "doorOpen", "value": "BINOMIAL(1, 0.8)" },
                        { "name": "error", "value": "POISSON(4)" }
                    ]
                }
            }

            try {
                const result = validador.schema(configInput);
                expect(result).to.be.true;
                done();
            } catch (err) {
                done(err);
            }
        });
    });
    describe('#distribution()', () => {
        it('should not throw exception of given a valid distribution', (done) => {
            const sensor = {
                name: 'temperature', value: 'NORMAL(23,2)'
            }
            const distribution = 'NORMAL';
            try {
                validador.sensor.distribution(sensor, distribution)
                done();
            } catch (err) {
                done(err);
            }
        });
        it('should throw exception of given a invalid distribution', () => {
            const sensor = {
                name: 'temperature', value: 'NORMAL(23,2)'
            }
            const distribution = 'NORMALA';
            expect(() => {
                validador.sensor.distribution(sensor, distribution);
            }).to.throw();
        });
    });
});