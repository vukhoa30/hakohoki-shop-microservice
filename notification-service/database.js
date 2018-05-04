var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

var parseRslt = (rslt) => {
  return rslt.map(r => {
    return {
      id: r._id,
      accountId: r.accountId,
      createdAt: r.createdAt,
      read: r.read,
      type: r.type,
      productId: r.productId,
      promotionId: r.promotionId,
      amount: r.amount,
      commentId: r.commentId
    }
  })
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
        else { resolve(parseRslt(rslt)) }
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
  },
  GetSubscribedAccountIds: (type, query) => {
    return new Promise((resolve, reject) => {
      models.Subscription
      .find({ type, ...query })
      .exec((err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt.map(r => r.accountId))
      })
    })
  },
  GetSubscriptions: (type, query) => {
    return new Promise((resolve, reject) => {
      models.Subscription
      .find({ type, ...query })
      .exec((err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt.map(r => r.productId))
      })
    })
  },
  AddSubscription: (type, accountId, subscriptionData) => {
    return new Promise((resolve, reject) => {
      var newSubscription = models.Subscription({ 
        type, 
        accountId, 
        ...subscriptionData 
      })
      newSubscription.save((err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt)
      })
    })
  },
  RemoveSubscription: (type, accountId, subscriptionQuery) => {
    return new Promise((resolve, reject) => {
      models.Subscription
      .remove({ type, accountId, ...subscriptionQuery }, (err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt)
      })
    })
  }
}
