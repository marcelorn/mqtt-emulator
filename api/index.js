const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

module.exports = (port) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use('/emulator', routes.emulator);
    app.use('/mqtt', routes.mqtt);
    
    app.listen(port, () =>
        console.log(`Starting API server on localhost:${port}`)
    );
}