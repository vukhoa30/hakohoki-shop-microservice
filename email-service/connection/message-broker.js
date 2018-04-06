var amqp = require('amqplib');
var amqpAddress = require('../config').amqpAddress;

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

module.exports = {
  consumeEmailRequest: () => {
    var core = require('../core');
    consumeAmqp(core.sendMail, 'emailRequest')
  }
}