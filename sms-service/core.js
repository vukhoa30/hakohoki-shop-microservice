var config = require('./config')
var Nexmo = require('nexmo')

var nexmo = new Nexmo(config.nexmoApi)

module.exports = {
  sendSMS: (requests) => {
    requests.forEach(request => { 
      if (request.phoneNumber[0] == '0') {
        request.phoneNumber = '84' + request.phoneNumber.slice(1)
      }

      switch (request.type) {
        case 'validationCode':
          nexmo.message.sendSms(
            config.nexmoFrom, 
            request.phoneNumber, 
            `Your validation code for your registration at 2K Shop: ${request.validationCode} `, 
            (error, response) => {
              if (error) {
                throw error;
              } else if (response.messages[0].status != '0') {
                console.error(response);
                throw 'Nexmo returned back a non-zero status';
              } else {
                console.log(response);
              }
            }
          )
          break
      }
    })
  }
}