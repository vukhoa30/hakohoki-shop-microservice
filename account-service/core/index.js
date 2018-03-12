var db = require('../database')
var helper = require('../helper')
var messageInit = require('../helper/message-init')
var messageBroker = require('../connection/message-broker')

exports.createNewAccount = function (email, password) {

    return new Promise((resolve, reject) => {
        db().collection("accounts").insertOne({ email: email, password: helper.hash(password), status: "NOT_AUTHORIZED" }, function (err, res) {
            if (err) {
                console.log(err)
                return reject()
            }
            messageBroker.sendMessage({ topic: 'ACCOUNT', message: { tag: 'ACCOUNT_NEEDING_AUTHORIZATION', email: email } })
            resolve()
        });

    })
}

exports.authenticate = async function (email, password) {

    return new Promise((resolve, reject) => {
        db().collection("accounts").findOne({ email: email }, function (err, res) {
            if (err) {
                console.log(err)
                return reject()
            }
            if (!res) return resolve({ code: 404, msg: "ACCOUNT NOT FOUND" })
            return helper.compareHashValue(password, res.password) ? resolve({ code: 200, token: helper.getToken(email, password) }) : resolve({ code: 404, msg: "PASSWORD WRONG" })
        })
    })

}

exports.validateAccount = function (email) {

    const query = { email: email }
    const newValue = { $set: { status: "AUTHORIZED" } }
    db().collection("accounts").updateOne(query, newValue, function (err, res) {
        if (err)
            console.log(err)
        else
            console.log(`Account ${email} authorized`)
    })

}