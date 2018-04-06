var express = require('express');
var app = express();
var server = require('http').createServer(app)
var responseAmqp = require('./message-broker')

var port = process.env.PORT || 7001;

responseAmqp.consumeEmailRequest()

server.listen(port, function(err) {
  if (err) {
    console.error("Error starting server.")
  }  
  console.log('Email service is listening at %s', port);
});