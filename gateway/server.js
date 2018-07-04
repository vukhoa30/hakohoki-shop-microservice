var db = require('./db');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

require('./socket')(server, db);
require('./api')(app, db);

var port = process.env.PORT || 8080;

server.listen(port, function(err) {
  if (err) {
    console.error("Error starting server.")
  }  
  console.log('Gateway %s listening at %s', app.name, port);
});