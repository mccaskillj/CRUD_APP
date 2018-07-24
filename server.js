const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = 8000;

require('./app/routes')(app, {});

app.listen(port, function () {
    console.log('listening on ' + port)
});

