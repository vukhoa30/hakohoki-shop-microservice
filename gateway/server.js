/*project này là 1 project restify, sửa url của request (api hoặc socket)
vd: post https://api.hakohoki.com/accounts/authenticate
-> post https://accounts-service.hakohoki.com/authenticate
*/

/*
  hiện tại áp dụng trên local, để lưu trong db ah
  db gồm: [ type: string, clientUrl: string, serviceUrl: string ]
  trong đó type là 'api' hoặc 'socket'.
  Nên chạy tất cả các websocket trước khi chạy server này
*/

var db = require('./db');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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