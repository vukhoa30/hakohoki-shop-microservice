var MongoClient = require('mongodb').MongoClient
var url = require('../helper/config.json').dbAddress
var dbclient = null

var mongoose = require('mongoose');
mongoose.connect(url);
var models = require('./models')(mongoose)

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

})

exports.checkIfExisted = (collection, query) => {

    return new Promise(async (resolve, reject) => {

        return resolve((await dbclient.db('account_service').collection(collection).find(query).limit(1).count()) > 0)

    })

}

exports.findOne = (collection, query) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).findOne(query, function (err, res) {

            if (err) {
                console.log(err)
                return reject(err)
            }
            return resolve(res)

        })

    })

}

exports.find = (collection, query) => {

    return new Promise((resolve, reject) => {

        dbclient.db('account_service').collection(collection).find(query, function (err, res) {

            if (err) {
                console.log(err)
                return reject(err)
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
                return reject(err)
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

exports.GetCustomers = (ids) => {
  return new Promise((resolve, reject) => {
    models.Account
    .find({ _id: {$in: ids} })
    .exec((err, rslt) => {
      if (err) { console.log(err); return reject(err) }
      resolve(rslt.map(r => {
        return { 
          accountId: r._id, 
          fullName: r.fullName, 
          email: r.email,
          role: 'customer'
        }
      }))
    })
  })
}

exports.GetAllCustomers = () => {
  return new Promise((resolve, reject) => {
    models.Account
    .find()
    .exec((err, rslt) => {
      if (err) { return reject(err) }
      resolve(rslt.map(r => { return { accountId: r._id, email: r.email } }))
    })
  })
}