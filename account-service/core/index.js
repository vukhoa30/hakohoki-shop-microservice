var db = require('../database')
var helper = require('../helper')
var messageBroker = require('../connection/message-broker')

exports.createNewAccount = function (email, password) {

    return new Promise(async (resolve, reject) => {

        try {
            await db.create('accounts', { email: email, password: helper.hash(password), status: "NOT_AUTHORIZED" })
            const authCode = helper.getRandomCode()
            await db.create('authorization', { email: email, code: authCode })
            messageBroker.sendMessage({ topic: 'EMAIL', message: { tag: 'SEND_AUTHORIZATION_MAIL', email: email, authCode: authCode } })
            resolve()
        } catch (error) {
            console.log(error)
            reject()
        }

    })
}

exports.authenticate = function (email, password) {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await db.findOne('accounts', { email: email })
            if (!result) return resolve({ code: 404, msg: "ACCOUNT NOT FOUND" })
            if (result.status === "NOT_AUTHORIZED") return resolve({ code: 401, msg: "ACCOUNT NOT AUTHORIZED" })
            return helper.compareHashValue(password, result.password) ? resolve({ code: 200, token: helper.getToken(email, password) }) : resolve({ code: 401, msg: "PASSWORD WRONG" })
        } catch (error) {
            console.log(error)
            reject()
        }

    })

}

exports.authorize = function (email, authCode) {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await db.checkIfExisted('authorization', { email: email, code: authCode })
            if (!result) return resolve(false)
            await db.update('accounts', { email: email }, { status: 'AUTHORIZED' })
            resolve(true)
        } catch (error) {
            console.log(error)
            reject()
        }

    })

}