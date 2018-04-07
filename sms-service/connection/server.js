var express = require('express');
var app = express();
var server = require('http').createServer(app)
var responseAmqp = require('./message-broker')

var port = process.env.PORT || 7009;

responseAmqp.consumeSMSRequest()

server.listen(port, function(err) {
  if (err) {
    console.error("Error starting server.")
  }  
  console.log('SMS service is listening at %s', port);
});