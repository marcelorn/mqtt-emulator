const moment = require('moment');

const utils = require('../utils');
const csv = require('../csv');

module.exports = config => {
    return new Promise((resolve, reject) => {
        const device = config.device;

        if (typeof device.frequency === 'string' || typeof device.frequency === 'number') {
            const frequencyExpression = utils.parseExpression(device.frequency);

            if (frequencyExpression) {

                let params = frequencyExpression[2];
                const [filePath, column] = params.split(':');
                const isNumberColumn = utils.isNumber(column);
                csv(filePath, { noheader: isNumberColumn }).then(csvResult => {
                    config.csvMap.set(filePath, csvResult);
                    csvResult.forEach(item => {
                        device.eventIntervals.push(
                            parseInt(
                                item[isNumberColumn ? parseInt(column) - 1 : column]
                            )
                        );
                    });
                    device.amount = device.eventIntervals.length;
                    resolve(config);
                });

            } else {

                device.frequency = parseInt(device.frequency);
                device.amount = Math.round(device.duration / device.frequency);
                resolve(config);
            }
        } else {
            const columnTimeExpression = utils.parseExpression(config.device.frequency.columnTime);
            const [timeFile, columnTime] = columnTimeExpression[2].split(':');
            const columnTimeFormat = config.device.frequency.columnTimeFormat;

            let dateFile, columnDate;
            let columnDateFormat = '';
            if (config.device.frequency.columnDate) {
                const columnDateExpression = utils.parseExpression(config.device.frequency.columnDate);
                [dateFile, columnDate] = columnDateExpression[2].split(':');
                columnDateFormat = config.device.frequency.columnDateFormat;
            }

            if (timeFile === dateFile
                || (timeFile !== null && dateFile === undefined)) {
                const isTimeColumnNumber = utils.isNumber(columnTime);
                csv(timeFile, { noheader: isTimeColumnNumber }).then(csvResult => {
                    config.csvMap.set(timeFile, csvResult);
                    const events = [];
                    for (let i = 0; i < csvResult.length; i++) {
                        const item = csvResult[i];
                        const columnTimeValue = isTimeColumnNumber ? item[parseInt(columnTime) - 1] : item[columnTime];
                        let columnDateValue = '';
                        if (columnDate) {
                            columnDateValue = utils.isNumber(columnDate) ? item[parseInt(columnDate) - 1] : item[columnDate];
                        }
                        const momentDate = moment(`${columnDateValue} ${columnTimeValue}`.trim(), `${columnDateFormat} ${columnTimeFormat}`.trim());
                        if (momentDate.isValid()) {
                            const timestamp = momentDate.valueOf();
                            const previousEvent = events[i - 1];
                            if (previousEvent) {
                                events.push({
                                    timestamp: momentDate.valueOf(),
                                    eventInterval: timestamp - previousEvent.timestamp
                                });
                            } else {
                                events.push({
                                    timestamp: timestamp,
                                    eventInterval: 0
                                });
                            }
                        }
                    }
                    device.eventIntervals.push(
                        ...events.map(event => { return event.eventInterval })
                    );
                    device.amount = device.eventIntervals.length;
                    resolve(config);
                });
            } else {
                reject('The file of the date and time columns must to be the same.');
            }
        }
    });
}