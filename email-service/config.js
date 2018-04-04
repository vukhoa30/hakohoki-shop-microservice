var nodemailer = require('nodemailer');

module.exports = {

  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '2kshopservice@gmail.com',
        pass: '2kdeveloper'
    },
    tls: { rejectUnauthorized: false }
  }),
  transporterName: '"2K Shop" <2kshopservice@gmail.com>',
  
  "amqpAddress": "amqp://localhost"
  
}