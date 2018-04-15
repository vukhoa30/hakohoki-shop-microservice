var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7010;
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
app.get('/', core.authenticateCustomer, core.getCart)
app.post('/', core.authenticateCustomer, core.addToCart)
app.put('/', core.authenticateCustomer, core.updateAmount)
app.delete('/', core.authenticateCustomer, core.removeFromCart)

//response Amqp
responseAmqp.responseClearCart()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Cart service is listening at port %d', port);
});
//---------------------------------------------------------------------------