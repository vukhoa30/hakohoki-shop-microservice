var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var config = require('./config.json')
var randomstring = require('randomstring')

exports.getToken = function (email, password) {

    return jwt.sign({ email: email, password: password }, config.privateKey)

}

exports.hash = function (value) {

    return bcrypt.hashSync(value, 10)

}

exports.compareHashValue = function (originVal, hashVal) {

    return bcrypt.compareSync(originVal, hashVal)

}

exports.getRandomCode = () => randomstring.generate()