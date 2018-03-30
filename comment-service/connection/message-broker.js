var amqp = require('amqplib');
var amqpAddress = require('../config.js').amqpAddress

var generateUuid = () => {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

var requestAmqp = (msgObject, queue) => {
  return new Promise((resolve, reject) => {
    amqp.connect(amqpAddress)
    .then(conn => {
      return conn.createChannel()
      .then(ch => { 
        return ch.assertQueue('', {exclusive: true})
        .then(q => {
          var corr = generateUuid()
          ch.consume(q.queue, msg => {
            if (msg.properties.correlationId === corr) {
              resolve(JSON.parse(msg.content.toString()))
              conn.close();
            }
          }, {noAck: true})
          ch.sendToQueue(queue,
            new Buffer(JSON.stringify(msgObject)),
            { correlationId: corr, replyTo: q.queue })
        })
      })
    })
    .catch(e => { reject(e); console.log(e) })
  })
}

module.exports = {
  requestAuthenticateCustomer: (token) => {
    return requestAmqp(token, 'authenticateCustomer')
  },
  requestAuthenticateEmployee: (token) => {
    return requestAmqp(token, 'authenticateEmployee')
  },
  requestCustomers: (ids) => {
    return requestAmqp(ids, 'getCustomers')
  },
  requestEmployees: (ids) => {
    return requestAmqp(ids, 'getEmployees')
  }
}