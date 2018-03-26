var express = require('express');
var app = express();
var server = require('http').createServer(app)

var port = process.env.PORT || 7001;

server.listen(port, function(err) {
  if (err) {
    console.error("Error starting server.")
  }  
  console.log('%s listening at %s', app.name, port);
});