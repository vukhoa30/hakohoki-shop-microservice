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

var restify = require('restify');
var bodyParser = require('body-parser');
var db = require('./db');

var server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
  requestBodyOnGet: true
}));

require('./socket')(server, db);
require('./api')(server, db);

var port = process.env.PORT || 8080;

server.listen(port, function(err) {
  if (err) {
    console.error("Error starting server.")
  }  
  console.log('Gateway %s listening at %s', server.name, server.url);
});