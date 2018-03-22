var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var jwtkey = require('./config').secretjwt
var tokenDuration = require('./config').tokenDuration

module.exports = {
  comparePassword: (raw, hashed) => {
    return bcrypt.compareSync(raw, hashed);
  },
  hashPassword: (raw) => {
    return bcrypt.hashSync(raw, bcrypt.genSaltSync(10))
  },
  signjwt: (payload) => {
    return jwt.sign(payload, jwtkey);
  },
  verifyjwt: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtkey, (err, decode) => {
        if (err) { reject(err) }
        else { resolve(decode) }
      })
    })
  },
  generateExpireTime: () => {
    return new Date(Date.now().getTime() + tokenDuration)
  }
}