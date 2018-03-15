/*
  client kết nối đến 'ws://localhost:8081/notification' thì gateway chuyển đến
  'ws://localhost:3003'
*/

var ioClient = require('socket.io-client');
//var proxy = require('http-proxy-middleware')
//var proxy = require('socket.io-proxy');

var getIDOnly = socketID => socketID.substring(socketID.indexOf('#') + 1);

module.exports = (server, db) => {

  /*
  proxy.init('http://localhost:8080/notification');
  var socket = proxy.connect('http://localhost:3003');

  socket.on('connect', () => {
    console.log('Socket connected!');
    socket.on('command', data => {
      console.log('Receive data! ' + data);
    })
    socket.on('disconnect', () => {
      console.log('Socket disconnected!');
    })
  })
  */

  /*var wsProxy = proxy('/notification', {
    target: 'http://localhost:3003',
    pathRewrite: {
      '^/notification': '/'
    },
    changeOrigin: true,
    ws: true,
  })

  app.use(wsProxy);

  return wsProxy;*/

  var io = require('socket.io')(server);
  clientSockets = [];

  io.on('connection', (socket) => {
    console.log('client connected!');
    //console.log(socket);
  });

  db.forEach(service => {
    if (service.type === 'socket') {
      io.of(service.clientUrl)
      .on('connection', socket => {
        console.log('connection!');
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