const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const appRoot = require('app-root-path');

const TMP_FOLDER = `${appRoot}/tmp/`;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/list', (req, res) => {
    fs.readdir(TMP_FOLDER, (err, list) => {
        res.send(list);
    });
});

app.get('/file/:name', (req, res) => {
    fs.readFile(`${TMP_FOLDER}${req.params.name}`, (err, data) => {
        res.json(JSON.parse(data));
    });
});

let server = app.listen(3000, function () {
    console.log('Server running on port 3000.');
});

app.get('/quit', (req, res) => {
    res.send('Stopping server...');
    server.close();
    process.exit(1);
});


