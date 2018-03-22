var db = require('./database')
//var helper = require('../helper')
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
  checkGuarantee: (req, res) => {
    //lấy thời gian của của sp trong db.GetBuyTime và lấy thông tin thời gian
    //bảo hành từ service product rồi trả về thời gian hết bảo hành
  },


  comment: (req, res) => {
    typicalResponse(res, db.Comment(req.body.comment));
  },
  getComments: (req, res) => {
    typicalResponse(res, db.GetComments(req.params.productId));
  }
}