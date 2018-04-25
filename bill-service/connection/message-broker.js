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
  requestAuthenticateCustomer: (token) => {
    return requestAmqp(token, 'authenticateCustomer')
  },
  requestUpdateSpecificsStatus: (ids) => {
    return requestAmqp(ids, 'updateSpecificsStatus')
  },
  requestGetEmployees: (ids) => {
    return requestAmqp(ids, 'getEmployees')
  },
  requestGetSpecificProducts: (specificIds) => {
    return requestAmqp(specificIds, 'getSpecificProducts')
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
  requestGetPendingProducts: (productIdsAndAmount) => {
    return requestAmqp(productIdsAndAmount, 'getPendingProducts')
  },
  requestClearCart: (accountId) => {
    return requestAmqp(accountId, 'clearCart')
  },
  requestGetSpecificInfos: (specificIds) => {
    return requestAmqp(specificIds, 'getSpecificInfos')
  },
  requestGetAllProducts: () => {
    return requestAmqp(null, 'getAllProducts')
  },
  requestGetAllCategories: () => {
    return requestAmqp(null, 'getAllCategories')
  }
}