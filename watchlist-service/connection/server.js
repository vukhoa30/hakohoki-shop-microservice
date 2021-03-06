var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7005;
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
app.get('/', core.getWatchlist)

app.post('/:productId', core.addToWatchlist)

app.delete('/:productId', core.removeFromWatchlist)

//response Amqp
responseAmqp.responseGetWatchlistUsers()
responseAmqp.responseCheckAlive()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Watchlist service is listening at port %d', port);
});
//---------------------------------------------------------------------------