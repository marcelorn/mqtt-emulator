const _Ajv = require('ajv');
const ajv = new _Ajv();

const expressionsTypes = require('../generate/expressions/expressions-types').list;
const _schema = require('./schema');

const schema = config => {
    const valid = ajv.validate(_schema, config);
    if (valid) {
        return true;
    } else {
        return ajv.errors;
    }
};

const msgs = {
    INVALID_SENSOR_EXPRESSION: (name, type, expressionsTypes) => {
        return `Expression '${type}' for the sensor '${name}' is invalid. 
    Expressions avaliable: ${expressionsTypes}.`
    }
}

const sensor = {
    expression: (sensor, expression) => {        
        if (!expressionsTypes.filter(type => {
            return type.toLowerCase() === expression.toLowerCase();
        }).length) {
            throw new Error(msgs.INVALID_SENSOR_EXPRESSION(sensor.name, expression, expressionsTypes));
        }
    }
}

module.exports = {
    sensor,
    schema,
}