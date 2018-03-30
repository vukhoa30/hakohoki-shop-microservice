var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var config = require('./config.json')
var randomstring = require('randomstring')
var tokenDuration = config.tokenDuration
var secretjwt = config.privateKey

exports.getToken = function (payload) {

    return jwt.sign(payload, config.privateKey)

}

exports.hash = function (value) {

    return bcrypt.hashSync(value, 10)

}

exports.compareHashValue = function (originVal, hashVal) {

    return bcrypt.compareSync(originVal, hashVal)

}

exports.getRandomCode = () => randomstring.generate(5)

exports.generateExpireTime = () => {
  var d = new Date();
  d.setTime(d.getTime() + tokenDuration);
  console.log(d);
  return new Date(Date.now() + tokenDuration)
}

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretjwt, (err, decode) => {
      if (err) { reject(err) }
      else { resolve(decode) }
    })
  })
}