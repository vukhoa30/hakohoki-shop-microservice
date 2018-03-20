module.exports = {
  //mongo ds215709.mlab.com:15709/product-service -u dummy -p sameasusername
  dbAddress: 'mongodb://dummy:sameasusername@ds215709.mlab.com:15709/product-service',
  messageBrokerAddress: "http://localhost:8000"
}

/*var MongoClient = require('mongodb').MongoClient
var url = require('../helper/config.json').dbAddress
var dbclient = null

MongoClient.connect(url, function (err, client) {
    if (err) throw err
    console.log("Database connected")
    dbclient = client
    dbclient.db("account_service").collection('accounts').createIndex({ email: 1}, { sparse: true, unique: true })
});

process.on("SIGNINT", function (signal) {
    if (dbclient != null) dbclient.close()
    dbclient = null
})

process.on("SIGTERM", function (signal) {
    if (dbclient != null) dbclient.close()
    dbclient = null
})*/