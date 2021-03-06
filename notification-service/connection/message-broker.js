var amqp = require('amqplib');
var amqpAddress = require('../config.js').amqpAddress

var generateUuid = () => {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

var timeOutMs = 300
var checkAlive = async (serviceName) => {
  return new Promise(r => {
    return Promise.race([
      requestAmqp(null, `checkAlive_${serviceName}`),
      new Promise(r => setTimeout(() => r(false), timeOutMs))
    ])
    .then(rslt => { 
      r(rslt)
      if (!rslt) console.log(serviceName + ' request timeout.') 
    })
  })
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

var consumeAmqp = (func, queue) => {
  amqp.connect('amqp://localhost')
  .then(conn => conn.createChannel())
  .then(ch => { 
    var ok = ch.assertQueue(queue, {durable: false});
    return ok.then(_qok => {
      return ch.consume(queue, msg => {

        func(JSON.parse(msg.content.toString()));
        
      }, {noAck: true})
    })
  })
  .catch(e => console.log(e))
}

var produceAmqp = (msgObject, queue) => {
  amqp.connect('amqp://localhost')
  .then(conn => { 
    return conn.createChannel()
    .then(ch => {
      var ok = ch.assertQueue(queue, {durable: false})
      return ok.then(_qok => {
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(msgObject)))
        console.log('Sent: ' + msgObject)
        return ch.close()
      })
    })
    .finally(() => conn.close())
  })
  .catch(e => console.log(e))
}

module.exports = {
  requestAuthenticateCustomer: (token) => {
    return requestAmqp(token, 'authenticateCustomer')
  },
  requestAuthenticateEmployee: (token) => {
    return requestAmqp(token, 'authenticateEmployee')
  },
  produceNotification: (notification) => {
    return produceAmqp(notification, 'notificate')
  },
  consumeNotificationRequest: () => {
    var core = require('../core')
    consumeAmqp(core.addNotification, 'notificationRequest')
  },
  requestGetProducts: async (productIds) => {
    if (await checkAlive('product')) {
      return requestAmqp(productIds, 'getProducts')
    } else { return new Promise(r => r(false)) }
  },
  requestGetPromotions: async (promotionIds) => {
    if (await checkAlive('promotion')) {
      return requestAmqp(promotionIds, 'getPromotions')
    } else { return new Promise(r => r(false)) }
  },
}