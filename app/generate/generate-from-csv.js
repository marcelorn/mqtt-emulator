const moment = require('moment');

const csv = require('../csv');

module.exports = config => {

    _columnsFilter = (csv, csvResult) => {
        if (csv.columns) {
            csvResult.forEach(item => {
                Object.keys(item).forEach(key => {
                    const column = csv.columns.filter(column => {
                        return column === key;
                    });
                    if (!column.length) {
                        delete item[key];
                    }
                });
            });
        }
    }

    _addEventInterval = (csv, csvResult) => {
        for (let i = 0; i < csvResult.length; i++) {

            const csvRow = csvResult[i];

            const momentDate = moment(`${csvRow[csv.columnDate]} ${csvRow[csv.columnTime]}`, `${csv.columnDateFormat} ${csv.columnTimeFormat}`);
            if (momentDate.isValid()) {
                const timestamp = momentDate.valueOf();
                if (csvResult[i - 1]) {
                    const previousCsvRow = csvResult[i - 1];
                    csvRow.__timestamp = momentDate.valueOf();
                    csvRow.__eventInterval = timestamp - previousCsvRow.__timestamp;
                } else {
                    csvRow.__timestamp = timestamp;
                    csvRow.__eventInterval = 0;
                }
            }
        }
    }

    generate = config => {        
        return new Promise((resolve, reject) => {

            csv(config.csv.file, { noheader: false }).then(csvResult => {
                try {
                    _addEventInterval(config.csv, csvResult);
                    _columnsFilter(config.csv, csvResult);
                    resolve(csvResult);
                } catch (err) {
                    reject(err);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    return generate(config);

};