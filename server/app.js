const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = require('./api');

const app = express();

app.set('port', process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use(function(err) {
    console.log(err.stack || err.message);
});

app.start = function startApp() {
    app.listen(app.get('port'), function appListen() {
        console.log(`app is running at http://localhost:${app.get('port')}`);
    });
};

module.exports = app;
