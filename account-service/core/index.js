var db = require('../database')
var helper = require('../helper')
//var messageBroker = require('../connection/message-broker')

exports.createNewAccount = function (email, password, fullName) {

    return new Promise(async (resolve, reject) => {

        try {
            if (await db.checkIfExisted('accounts', { email: email })) return resolve(false)
            await db.create('accounts', { email: email, password: helper.hash(password), status: "NOT_ACTIVATED", fullName })
            const activationCode = helper.getRandomCode()
            console.log(activationCode)
            await db.create('activation', { email: email, code: activationCode })
            //messageBroker.sendMessage({ topic: 'EMAIL', message: { tag: 'SEND_AUTHORIZATION_MAIL', email: email, authCode: authCode } })
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })
}

exports.authenticate = function (email, password) {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await db.findOne('accounts', { email: email })
            if (!result) return resolve({ code: 404, msg: "ACCOUNT NOT FOUND" })
            if (result.status === "NOT_ACTIVATED") return resolve({ code: 401, msg: "ACCOUNT NOT ACTIVATED" })
            return helper.compareHashValue(password, result.password) ? resolve({ code: 200, token: helper.getToken({
              email, 
              role: 'customer',
              expireTime: helper.generateExpireTime()
            }) }) : resolve({ code: 401, msg: "PASSWORD WRONG" })
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })

}

exports.activate = function (email, activationCode) {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await db.checkIfExisted('activation', { email: email, code: activationCode })
            if (!result) return resolve(false)
            await db.update('accounts', { email: email }, { status: 'ACTIVATED' })
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }

    })

}