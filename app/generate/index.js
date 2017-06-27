const fromFile = require('./generate-from-file');
const fromExpressions = require('./generate-from-expressions');
const fromCsv = require('./generate-from-csv');

module.exports = config => {
    switch (config.generationType) {
        case 'file':
            return fromFile(config);
        case 'expression':
            return fromExpressions(config);
        case 'csv':
            return fromCsv(config);
        default:
            return new Error('Generation type is invalid.');
    }
}