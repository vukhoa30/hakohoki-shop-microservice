var db = require('./database')
var helper = require('./helper.js')
var messageBroker = require('./connection/message-broker')

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
  getCurrentPromotion: (req, res) => {
    typicalResponse(res, db.GetCurrentPromotion());
  },
  getNewPrices: (req, res) => {
    typicalResponse(res, db.GetNewPrice(req.body.productIds));
  }
}