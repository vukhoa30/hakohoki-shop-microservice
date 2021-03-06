var amqp = require('amqplib');
var db = require('../database.js');
var amqpAddress = require('../config.js').amqpAddress;

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

var responseAmqp = (promise, queue) => {
  amqp.connect(amqpAddress)
  .then(conn => { 
    return conn.createChannel()
    .then(ch => {
      ch.assertQueue(queue, {durable: false})
      ch.prefetch(1)
      console.log('Awating...')
      ch.consume(queue, async (msg) => {
        var response = []
        try {
          response = await promise(JSON.parse(msg.content.toString()))
        } catch (e) { console.log(e) }
        ch.sendToQueue(msg.properties.replyTo,
          new Buffer(JSON.stringify(response)),
          {correlationId: msg.properties.correlationId})
        ch.ack(msg)
        console.log('Sent: ' + response)
      })
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
  requestAuthenticateEmployee: (token) => {
    return requestAmqp(token, 'authenticateEmployee')
  },
  requestGetProducts: (productIds) => {
    return requestAmqp(productIds, 'getProducts')
  },
  responsePromotionInfos: () => {
    responseAmqp(db.GetPromotionInfos, 'getPromotionInfos')
  },
  produceNotificationRequest: (requests) => {
    return produceAmqp(requests, 'notificationRequest')
  },
  produceEmailRequest: (requests) => {
    return produceAmqp(requests, 'emailRequest')
  },
  requestGetAllCustomers: () => {
    return requestAmqp({}, 'getAllCustomers')
  },
  responseGetPromotions: (promotionIds) => {
    responseAmqp(db.GetPromotions, 'getPromotions')
  },
  responseCheckAlive: () => {
    responseAmqp(() => { return new Promise(r => r(true)) }, 'checkAlive_promotion')
  }
}