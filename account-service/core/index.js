var db = require('../database')
var helper = require('../helper')
var msgBroker = require('../connection/message-broker')

exports.createNewAccount = function (email, password, fullName, phoneNumber) {

    return new Promise(async (resolve, reject) => {

        try {
            if (await db.checkIfExisted('accounts', { email, phoneNumber })) return resolve(false)
            await db.create('accounts', { email: email, password: helper.hash(password), status: "NOT_ACTIVATED", fullName, phoneNumber })
            const activationCode = helper.getRandomCode()
            console.log(activationCode)
            await db.create('activation', { phoneNumber, code: activationCode })
            msgBroker.produceSMSRequest([{
              type: 'validationCode',
              phoneNumber: phoneNumber,
              validationCode: activationCode,
            }])
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })
}

exports.authenticate = function (email, phoneNumber, password) {

    return new Promise(async (resolve, reject) => {
        try {
            const result = await db.findOne('accounts', { email, phoneNumber })
            if (!result) return resolve({ code: 404, msg: "ACCOUNT NOT FOUND" })
            if (result.status === "NOT_ACTIVATED") return resolve({ code: 401, msg: "ACCOUNT NOT ACTIVATED" })
            return helper.compareHashValue(password, result.password) ? resolve({ 
              code: 200, 
              token: helper.getToken({
                accountId: result._id,
                role: 'customer',
                expireTime: helper.generateExpireTime()
              }),
              account: {
                accountId: result._id,
                email: result.email,
                role: 'customer',
                fullName: result.fullName,
                phoneNumber: result.phone_number
              }
            }) : resolve({ code: 401, msg: "PASSWORD WRONG" })
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })

}

exports.activate = function (email, phoneNumber, activationCode) {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await db.checkIfExisted('activation', { email, phoneNumber, code: activationCode })
            if (!result) return resolve(false)
            var rslt = await db.update('accounts', { email, phoneNumber }, { status: 'ACTIVATED' })
            resolve(rslt)
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })

}

exports.authenticateCustomer = (token) => {
  return new Promise((resolve, reject) => {
    helper.verifyToken(token)
    .then(decode => {
      resolve({
        accountId: decode.accountId,
        role: decode.role
      })
    })
    .catch(e => {resolve(false)})
  })
}