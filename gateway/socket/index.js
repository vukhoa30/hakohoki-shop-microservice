/*
  client kết nối đến 'ws://localhost:8081/notification' thì gateway chuyển đến
  'ws://localhost:3003'
*/

var ioClient = require('socket.io-client');

var getIDOnly = socketID => socketID.substring(socketID.indexOf('#') + 1);

module.exports = (server, db) => {

  var io = require('socket.io')(server.server);
  clientSockets = [];

  io.on('connection', (socket) => {
    socket.emit('tweet', {user: 'nodesource', text: 'Hello world!'});
  });
  db.forEach(service => {
    if (service.type === 'socket') {
      io.of(service.clientUrl)
      .on('connection', socket => {
        socket.on('give-username', data => {
          clientSockets.push({...socket, username: data.username})
        })
        socket.on('disconnect', () => {
          clientSockets.splice(
            clientSockets.indexOf(socket), 1
          )
        })
      });

      var serviceSocket = ioClient(service.serviceUrl);
      serviceSocket.on('message', data => {
        var socketDes = clientSockets.find(clientSocket =>
          clientSocket.username === data.username
        );
        if (socketDes) {
          io.of(service.clientUrl).to(socketDes.id).emit('message', data)
        }
      })
    }
  });
}