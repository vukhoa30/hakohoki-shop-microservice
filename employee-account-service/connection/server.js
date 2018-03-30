var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7003;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

var amqpResponse = require('./message-broker')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
//app.post('/authenticate', core.authenticate)
app.post('/', core.createAccount)
app.post('/login', core.logIn)

app.put('/password', core.changePassword)
app.put('/reactivate', core.reactiveAccount)
app.put('/deactivate', core.deactiveAccount)

//Respone RPC
amqpResponse.responseAuthenticateEmployee()
amqpResponse.responseGetEmployees()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Employee-account service is listening at port %d', port);
});
//---------------------------------------------------------------------------