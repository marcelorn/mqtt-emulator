const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

const host = '0.0.0.0';

module.exports = (port, configFile) => {

    console.log(`API Server: using settings from ${configFile}`);
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    app.set('config', config);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use('/emulator', routes.emulator);
    app.use('/mqtt', routes.mqtt);

    app.post('/config',function(req, res){
        app.set('config', req.body);
        console.log(`Configuration has been set: ${JSON.stringify(req.body)}`);
        return res.status(200).send({'success': true});
    });
    
    app.listen(port, host, () =>
        console.log(`Starting API server on ${host}:${port}`)
    );
}