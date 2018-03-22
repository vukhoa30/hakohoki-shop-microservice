var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7005;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.post('/info', core.getWatchlist)
app.post('/', core.addToWatchlist)

app.delete('/', core.removeFromWatchlist)

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Watchlist service is listening at port %d', port);
});
//---------------------------------------------------------------------------