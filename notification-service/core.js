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
  getNotification: async (req, res) => {
    try {
      res.json(await db.GetNotifications(req.authentication.accountId))
    } catch (e) { catchError(res, e) }
  },
  addNotification:  (notifications) => {
    return new Promise(async (resolve, reject) => {
      try {
        db.AddNotification(notifications.map(n => {
          return {
            ...n,
            productName: undefined,
            promotionName: undefined,
          }
        }))
        msgBroker.produceNotification(notifications.map(n => {
          return {
            ...n,
            time: new Date()
          }
        }))
        resolve(true)
      } catch (e) { catchError(res, e) }
    })
  },
  readNotifications: async (req, res) => {
    try {
      var rslt = await db.ReadNotifications(req.body, req.authentication.accountId)
      res.json({ok: true})
    } catch (e) { catchError(res, e) }
  }
}