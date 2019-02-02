const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = require('./api');

const app = express();

app.set('port', process.env.PORT);
app.set('baseUrl', `http://localhost:${app.get('port')}`);
app.set('assetsFolder', path.join(__dirname, '..', 'client'));
app.set('indexFile', path.join(__dirname, '..', 'client', 'index.html'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(express.static(app.get('assetsFolder')));

app.use('*', function(req, res) {
    res.sendFile(app.get('indexFile'));
});

app.use(function(err) {
    console.log(err.stack || err.message);
});

app.start = function() {
    app.listen(app.get('port'), function() {
        console.log(`app is running at ${app.get('baseUrl')}`);
    });
};

module.exports = app;
