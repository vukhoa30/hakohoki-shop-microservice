var redis = require('redis')
var db = require('./database')
var helper = require('./helper.js')
var msgBroker = require('./connection/message-broker')

var redisConnection = require('./config.js').redisConnection
var client = redis.createClient(redisConnection)

const CACHE_CURRENT_PROMOTION = 'currentPromotion'

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
  createPromotion: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'manager') { 
        return catchUnauthorized(res)
      }
    } catch (e) { return catchError(res, e) }

    db.CreatePromotion(req.body)
    .then(rslt => {
      res.json({ ok: true })
    })
    .catch(err => catchError(res, err))
  },
  cacheCurrentPromotion: (req, res, next) => {
    client.get(CACHE_CURRENT_PROMOTION, (err, data) => {
      if (data != null) {
        console.log('cache taken')
        res.json(JSON.parse(data));
      } else {
        next();
      }
    })
  },
  getCurrentPromotion: (req, res) => {
    db.GetCurrentPromotion()
    .then(async rslt => {
      rslt.products = await msgBroker.requestGetProducts(rslt.products.map(p => p.id))
      client.setex(CACHE_CURRENT_PROMOTION, 10, JSON.stringify(rslt));
      res.json(rslt);
    })
    .catch(e => catchError(res, e))
  },
  getNewPrices: (req, res) => {
    typicalResponse(res, db.GetNewPrice(req.body.productIds));
  }
}