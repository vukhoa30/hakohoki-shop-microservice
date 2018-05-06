var amqp = require('amqplib');
var amqpAddress = require('../config.js').amqpAddress
//var core = require('../core.js')

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
  requestPromotionInfos: (productIds) => {
    return requestAmqp(productIds, 'getPromotionInfos')
  },
  responseGetProducts: () => {
    var core = require('../core.js')
    responseAmqp(core.getProductsByIds, 'getProducts')
  },
  responseGetSpecificProducts: () => {
    var core = require('../core.js')
    responseAmqp(core.getProductsBySpecificIds, 'getSpecificProducts')
  },
  requestAuthenticateEmployee: (token) => {
    return requestAmqp(token, 'authenticateEmployee')
  },
  requestAuthenticateCustomer: (token) => {
    return requestAmqp(token, 'authenticateCustomer')
  },
  responseUpdateSpecificsStatus: () => {
    var db = require('../database.js')
    responseAmqp(db.UpdateSpecificsStatus, 'updateSpecificsStatus')
  },
  requestReviewScores: (productIds) => {
    return requestAmqp(productIds, 'getProductsScore')
  },
  requestGetWatchlistUsers: (productIds) => {
    return requestAmqp(productIds, 'getWatchlistUsers')
  },
  produceEmailRequest: (requests) => {
    return produceAmqp(requests, 'emailRequest')
  },
  produceNotificationRequest: (requests) => {
    return produceAmqp(requests, 'notificationRequest')
  },
  requestCustomers: (ids) => {
    return requestAmqp(ids, 'getCustomers')
  },
  requestCheckReviewed: (accountAndProductId) => {
    return requestAmqp(accountAndProductId, 'checkReviewed')
  },
  responseGetPendingProducts: () => {
    var core = require('../core')
    responseAmqp(core.getPendingProducts, 'getPendingProducts')
  },
  responseGetSpecificInfos: () => {
    var core = require('../core')
    responseAmqp(core.getSpecificInfos, 'getSpecificInfos')
  },
  responseGetAllProducts: () => {
    var db = require('../database')
    responseAmqp(db.GetAllProducts, 'getAllProducts')
  },
  responseGetAllCategories: () => {
    var db = require('../database')
    responseAmqp(db.GetAllCategories, 'getAllCategories')
  }
}