var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

module.exports = {
  AddNotifications: (notifications) => {
    return new Promise((resolve, reject) => {
      models.Notification
      .insertMany(notifications, (err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt)
      })
    })
  },
  GetNotifications: (accountId) => {
    return new Promise((resolve, reject) => {
      models.Notification
      .find({ accountId })
      .sort({ 'createdAt': -1 })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(rslt) }
      })
    })
  },
  ReadNotifications: (ids, accountId) => {
    return new Promise((resolve, reject) => {
      models.Notification
      .updateMany(
        { _id: {$in: ids.map(id => mongoose.Types.ObjectId(id))},
          accountId },
        { $set: {read: true} },
        (err, rslt) => {
          if (err) { return reject(err) }
          resolve(rslt)
        }
      )
    })
  }
}
