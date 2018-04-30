/*
  client kết nối đến 'ws://localhost:8081/notification' thì gateway chuyển đến
  'ws://localhost:3003'
*/

//var ioClient = require('socket.io-client');
var amqp = require('amqplib')
var amqpAddress = require('../config').amqpAddress
//var proxy = require('http-proxy-middleware')
//var proxy = require('socket.io-proxy');

var getIDOnly = socketID => socketID.substring(socketID.indexOf('#') + 1);

/*
var responseAmqpNotification = (io, queue) => {
  amqp.connect(amqpAddress)
  .then(conn => { 
    return conn.createChannel()
    .then(ch => {
      ch.assertQueue(queue, {durable: false})
      ch.prefetch(1)
      console.log('Awating...')
      ch.consume(queue, async (msg) => {
        content = JSON.parse(msg.content.toString())
        try {
          //console.log(content)
          content.map(notification => {
            var socketDes = clientSockets.find(clientSocket =>
              clientSocket.accountId.toString() == notification.accountId.toString()
            );
            if (socketDes) {
              //console.log(socketDes.id)
              notification.accountId = undefined
              io.of('/notifications').to(socketDes.id).emit('message', notification)
            }
          })
        } catch (e) { console.log(e) }
        var response = {ok:true}
        ch.sendToQueue(msg.properties.replyTo,
          new Buffer(JSON.stringify(response)),
          {correlationId: msg.properties.correlationId})
        ch.ack(msg)
        console.log('Sent: ' + response)
      })
    })
  })
  .catch(e => console.log(e))
}*/

var consumeAmqpNotification = (io, queue) => {
  amqp.connect(amqpAddress)
  .then(conn => conn.createChannel())
  .then(ch => { 
    var ok = ch.assertQueue(queue, {durable: false});
    return ok.then(_qok => {
      return ch.consume(queue, msg => {

        content = JSON.parse(msg.content.toString())
        console.log(content)
        content.map(notification => {
          var socketDes = clientSockets.find(clientSocket =>
            clientSocket.accountId.toString() === notification.accountId.toString()
          );
          if (socketDes) {
            console.log('SOCKET_ID: ' + socketDes.id)
            notification.accountId = undefined
            io.of('/notifications').to(socketDes.id).emit('message', notification)
          }
        })
        
      }, {noAck: true})
    })
  })
  .catch(e => console.log(e))
}

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

  var io = require('socket.io')(server, { pingTimeout: 30000, pingInterval: 30000 });
  clientSockets = [];

  io.on('connection', (socket) => {
    //console.log('client connected!');
  });

  //io.of(service.clientUrl)
  io.of('/notifications')
  .on('connection', socket => {
    socket.on('give-accountid', data => {
      clientSockets.push({...socket, accountId: data})
      console.log(clientSockets.map(m=>{return{id: m.id, accountId: m.accountId}}))
    })
    socket.on('disconnect', () => {
      clientSockets.splice(
        clientSockets.indexOf(socket), 1
      )
    })
  });

  consumeAmqpNotification(io, 'notificate')

  /*var serviceSocket = ioClient(service.serviceUrl);
  serviceSocket.on('message', data => {
    var socketDes = clientSockets.find(clientSocket =>
      clientSocket.username === data.username
    );
    if (socketDes) {
      io.of(service.clientUrl).to(socketDes.id).emit('message', data)
    }
  })*/
}