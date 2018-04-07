var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7007;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

var responseAmqp = require('./message-broker')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.get('/:productId', core.getComments)

app.post('/', core.comment)

//response amqp
responseAmqp.responseReviewScores()
responseAmqp.responseCheckReviewed()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Comment service is listening at port %d', port);
});
//---------------------------------------------------------------------------