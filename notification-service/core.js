var db = require('./database')
//var helper = require('../helper')
var msgBroker = require('./connection/message-broker')

//chỉ chạy 1 promise
var typicalResponse = (res, func) => {
  func.then(rslt => res.json(rslt))
  .catch(err => catchError(res, err));
}

var catchError = (res, err) => {
  console.log(err)
  res.status(500);
  res.json({ msg: 'INTERNAL SERVER ERROR', err: err });
}

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

module.exports = {
  authenticate: async (req, res, next) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateCustomer(token)
      if (!authentication) {
        authentication = await msgBroker.requestAuthenticateEmployee(token)
      }
      if (!authentication) { return catchUnauthorized(res) }

      req.authentication = authentication
      next()
    } catch (e) { catchError(res, e) }
  },
  getNotifications: async (req, res) => {
    try {
      var notifications = await db.GetNotifications(req.authentication.accountId)
      var productIds = []
      var promotionIds = []
      notifications.forEach(n => {
        if (n.productId) { productIds.push(n.productId) }
        if (n.promotionId) { promotionIds.push(n.promotionId) }
      })
      var products = (await msgBroker.requestGetProducts(productIds)) || []
      var promotions = (await msgBroker.requestGetPromotions(promotionIds)) || []
      notifications.forEach(n => {
        if (n.productId) {
          var finder = products.find(p => p._id.toString() == n.productId.toString())
          if (finder) { n.productName = finder.name }
        }
        if (n.promotionId) {
          var finder = promotions.find(p => p.id === n.promotionId)
          if (finder) { n.promotionName = finder.name }
        }
      })
      res.json(notifications)
    } catch (e) { catchError(res, e) }
  },
  addNotification:  (notifications) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (notifications[0] && notifications[0].type === 'commentPosted') {
          var subscriptions = await db.GetSubscribedAccountIds('commentPosted', {
            productId: notifications[0].productId
          })
          notifications = notifications.filter(n => 
            subscriptions.indexOf(n.accountId.toString()) >= 0)
        }
        
        var rslt = await db.AddNotifications(notifications.map(n => {
          return {
            ...n,
            createdAt: new Date(),
            productName: undefined,
            promotionName: undefined,
          }
        }))
        msgBroker.produceNotification(rslt.map(r => {
          if (r.productId) {
            var finder = notifications.find(n =>
              r.productId.toString() == n.productId.toString()
            )
            r.productName = finder.productName
          }
          if (r.promotionId) {
            var finder = notifications.find(n =>
              r.promotionId.toString() == n.promotionId.toString()
            )
            r.promotionName = finder.promotionName
          }
          return {
            createdAt: r.createdAt,
            read: r.read,
            type: r.type,
            accountId: r.accountId,
            productId: r.productId,
            id: r._id,
            commentId: r.commentId,
            parentId: r.parentId,
            billId: r.billId,
            productName: r.productName,
            promotionName: r.promotionName
          }
        }))
        resolve(true)
      } catch (e) { console.log(e);reject(false) }
    })
  },
  readNotifications: async (req, res) => {
    try {
      var rslt = await db.ReadNotifications(req.body, req.authentication.accountId)
      res.json({ok: true})
    } catch (e) { catchError(res, e) }
  },
  getSubscriptionsCommentPosted: async (req, res) => {
    try {
      if (req.authentication.role === 'customer') { 
        return catchUnauthorized(res) 
      }
      var subscriptionProductIds = await db.GetSubscriptions('commentPosted',
        { accountId: req.authentication.accountId })
      var products = await msgBroker.requestGetProducts(subscriptionProductIds)
      console.log(products)
      var rslt = []
      subscriptionProductIds.forEach(id => {
        var finder = products.find(p => p._id.toString() == id.toString())
        if (finder) {
          rslt.push({
            productId: id,
            productName: finder.name,
            mainPicture: finder.mainPicture
          })
        }
        else { rslt.push({ productId: id }) }
      })
      res.json(rslt)
    } catch (e) { catchError(res, e) }
  },
  subscribeCommentPosted: async (req, res) => {
    try {
      if (req.authentication.role === 'customer') { 
        return catchUnauthorized(res) 
      }
      var rslt = await db.AddSubscription('commentPosted', 
        req.authentication.accountId, 
        req.body)
      res.json({ ok: true })
    } catch (e) { catchError(res, e) }
  },
  unsubscribeCommentPosted: async (req, res) => {
    try {
      if (req.authentication.role === 'customer') { 
        return catchUnauthorized(res) 
      }
      var rslt = await db.RemoveSubscription('commentPosted',
        req.authentication.accountId,
        { productId: req.body.productId })
      res.json({ ok: true })
    } catch (e) { catchError(res, e) }
  }
}