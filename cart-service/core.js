var db = require('./database')
var helper = require('./helper.js')
var msgBroker = require('./connection/message-broker')

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
  authenticateCustomer: async (req, res, next) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateCustomer(token)
      if (!authentication) { return catchUnauthorized(res) }

      req.authentication = authentication
      next()
    } catch (e) { catchError(res, e) }
  },
  getCart: async (req, res) => {
    try {
      var cart = await db.GetCart(req.authentication.accountId);
      var products = await msgBroker.requestGetProducts(cart.map(product =>
        product.productId));
      res.json(products.map(p => {
        var finder = cart.find(product => 
          product.productId.toString() == p._id.toString())
        p.amount = finder.amount
        return p
      }))
    } catch(e) { catchError(res, e) }
  },
  addToCart: async (req, res) => {
    try {
      var rslt = await db.AddToCart(req.authentication.accountId,
        req.body.productId)
      if (rslt.rowCount > 0) {
        res.json({ ok: true })
      } else {
        res.json({ ok: false })
      }
    } catch(e) { catchError(res, e) }
  },
  updateAmount: async (req, res) => {
    try {
      var rslt = await db.UpdateAmount(req.authentication.accountId,
        req.body.productId, req.body.amount)
      if (rslt > 0) {
        res.json({ ok: true })
      } else {
        res.json({ ok: false })
      }
    } catch(e) { catchError(res, e) }
  },
  removeFromCart: async (req, res) => {
    try {
      var rslt = await db.RemoveFromCart(req.authentication.accountId, req.body.productId)
      if (rslt > 0) {
        res.json({ ok: true })
      } else {
        res.json({ ok: false })
      }
    } catch(e) { catchError(res, e) }
  }
}