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

module.exports = () => dbclient.db("account_service")