var amqp = require('amqplib');
var amqpAddress = require('../config').amqpAddress;
var core = require('../core');
var db = require('../database')

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
        } catch (e) { }
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

module.exports = {
  responseAuthenticateEmployee: () => {
    responseAmqp(require('../core').authenticateEmployee, 'authenticateEmployee')
  },
  responseGetEmployees: () => {
    responseAmqp(db.GetEmployees, 'getEmployees')
  },
  responseGetAllEmployees: () => {
    responseAmqp(db.GetAllEmployeeIds, 'getAllEmployees')
  }
}