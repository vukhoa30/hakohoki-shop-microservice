var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var config = require('./config.json')
var randomstring = require('randomstring')
var tokenDuration = require('./config.json').tokenDuration

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