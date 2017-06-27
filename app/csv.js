const csv = require('csvtojson');

module.exports = (filePath, options) => {

  return new Promise((resolve, reject) => {

    const csvResult = [];

    csv({ noheader: options.noheader }).fromFile(filePath)
      .on(options.noheader ? 'csv' : 'json', result => {
        csvResult.push(result);
      }).on('done', (err) => {
        if (err) {
          reject(new Error(`${err.message}:${filePath}`));
        } else {
          resolve(csvResult);
        }
      }).on('error', err => reject);

  });

}

