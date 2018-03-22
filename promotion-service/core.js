var redis = require('redis')
var db = require('./database')
var helper = require('./helper.js')
var messageBroker = require('./connection/message-broker')

var redisPort = require('./config.js').redisPort
var client = redis.createClient(redisPort)

const CACHE_CURRENT_PROMOTION = 'currentPromotion'

//chỉ chạy 1 promise
var typicalResponse = (res, func) => {
  func.then(rslt => res.json(rslt))
  .catch(err => catchError(res, err));
}

var catchError = (res, err) => {
  res.status(500);
  res.json({ msg: 'INTERNAL SERVER ERROR', err: err });
}

module.exports = {
  createPromotion: (req, res) => {
    typicalResponse(res, db.CreatePromotion(req.body.promotion));
  },
  cacheCurrentPromotion: (req, res, next) => {
    client.get(CACHE_CURRENT_PROMOTION, (err, data) => {
      if (data != null) {
        res.json(JSON.parse(data));
      } else {
        next();
      }
    })
  },
  getCurrentPromotion: (req, res) => {
    db.GetCurrentPromotion()
    .then(rslt => {
      client.setex(CACHE_CURRENT_PROMOTION, 3600, JSON.stringify(rslt));
      res.json(rslt);
    })
    .catch(e => catchError(res, e))
    //thiếu 1 bước lấy tên sản phẩm
  },
  getNewPrices: (req, res) => {
    typicalResponse(res, db.GetNewPrice(req.body.productIds));
  }
}