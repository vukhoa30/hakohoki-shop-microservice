var MongoClient = require('mongodb').MongoClient
var url = require('../helper/config.json').dbAddress
var dbclient = null

MongoClient.connect(url, function (err, client) {
    if (err) throw err
    console.log("Database connected")
    dbclient = client
});

process.on("SIGNINT", function (signal) {

    if (dbclient != null) dbclient.close()
    dbclient = null

})

process.on("SIGTERM", function (signal) {

    if (dbclient != null) dbclient.close()
    dbclient = null

})

exports.find = (collection, query) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).find(query, function (err, res) {

            if (err) {
                console.log(err)
                return reject()
            }
            return resolve(res)

        })

    })

}

exports.create = (collection, obj) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).insertOne(obj, function (err, res) {

            if (err) {
                console.log(err)
                return reject()
            }
            return resolve(res)

        })

    })

}

exports.update = (collection, query, obj) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).updateOne(query, { $set: obj }, function (err, res) {

            if (err) {
                console.log(err)
                return reject()
            }
            return resolve(res)

        })

    })

}

exports.delete = (collection, query) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).deleteOne(query, function (err, res) {

            if (err) {
                console.log(err)
                return reject()
            }
            return resolve(res)

        })


    })

}