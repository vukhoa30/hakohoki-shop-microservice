var db = require('../database')
var helper = require('../helper')
var messageInit = require('../helper/message-init')
//var messageBroker = require('../connection/message-broker')

exports.createNewAccount = function (email, password) {

    return new Promise(async (resolve, reject) => {

        try {
            await db.create('accounts', { email: email, password: helper.hash(password), status: "NOT_AUTHORIZED" })
            //messageBroker.sendMessage({ topic: 'ACCOUNT', message: { tag: 'ACCOUNT_NEEDING_AUTHORIZATION', email: email } })
            resolve()
        } catch (error) {
            console.log(error)
            reject()
        }

    })
}

exports.authenticate = async function (email, password) {

    return new Promise((resolve, reject) => {

        try {
            const result = await db.find('accounts', { email: email })
            if (result.length === 0) return resolve({ code: 404, msg: "ACCOUNT NOT FOUND" })
            const account = result[0]
            if (account.status === "NOT_AUTHORIZED") return resolve({ code: 401, msg: "ACCOUNT NOT AUTHORIZED" })
            return helper.compareHashValue(password, account.password) ? resolve({ code: 200, token: helper.getToken(email, password) }) : resolve({ code: 401, msg: "PASSWORD WRONG" })
        } catch (error) {
            console.log(error)
            reject()
        }

    })

}

exports.validateAccount = async function (email) {

    const query = { email: email }
    const newValue = { $set: { status: "AUTHORIZED" } }

    try {
        await db.update('accounts', query, newValue)
        console.log(`Account ${email} has been authorized`)
    } catch (error) {
        console.log(error)
    }

}