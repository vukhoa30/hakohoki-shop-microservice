var db = require('./database')
var msgBroker = require('./connection/message-broker')

//chỉ chạy 1 promise
var typicalResponse = (res, func) => {
  func.then(rslt => res.json(rslt))
  .catch(err => catchError(res, err));
}

var catchError = (res, err) => {
  res.status(500);
  res.json({ msg: 'INTERNAL SERVER ERROR', err: err });
}

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

var requestAuthentication = (req) => {
  return new Promise(async(resolve, reject) => {
    var token
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } 
    try {
      var authentication = await msgBroker.requestAuthenticateCustomer(token)
    } catch (e) { reject(e) }
    resolve(authentication)
  })
}

module.exports = {
  addToWatchlist: async (req, res) => {
    var authentication;
    try {
      authentication = await requestAuthentication(req)
      if (authentication.role !== 'customer') { return catchUnauthorized(res) }
    } catch(e) { return catchUnauthorized(res) }

    db.AddToWatchlist(authentication.accountId, req.params.productId)
    .then(rslt => {
      if (rslt.rowCount > 0) {
        res.json({ msg: 'Added.', ok: true })
      } else {
        res.json({ msg: 'Failed to add.'})
      }
    })
    .catch(e => catchError(res, e))
  },
  removeFromWatchlist: async (req, res) => {
    var authentication;
    try {
      authentication = await requestAuthentication(req)
      if (authentication.role !== 'customer') { return catchUnauthorized(res) }
    } catch(e) { return catchUnauthorized(res) }

    db.RemoveFromWatchlist(authentication.accountId, req.params.productId)
    .then(rslt => {
      if (rslt > 0) {
        res.json({ msg: 'Deleted.', ok: true })
      } else {
        res.json({ msg: 'Failed to delete.'})
      }
    })
    .catch(e => catchError(res, e))
  },
  getWatchlist: async (req, res) => {
    var authentication;
    try {
      authentication = await requestAuthentication(req)
      if (authentication.role !== 'customer') { return catchUnauthorized(res) }
    } catch(e) { return catchUnauthorized(res) }

    db.GetWatchlist(authentication.accountId, 
      req.query.limit,
      req.query.offset)
    .then(productIds => { return msgBroker.requestGetProducts(productIds) })
    .then(watchlist => {
      res.json(watchlist)
    })
    .catch(e => catchError)
  },
}