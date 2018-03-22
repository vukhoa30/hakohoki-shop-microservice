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
  addToWatchlist: (req, res) => {
    db.AddToWishlist(req.body.email, req.body.productId)
    .then(rslt => {
      if (rslt.rowCount > 0) {
        res.json({ msg: 'Added.', ok: true })
      } else {
        res.json({ msg: 'Failed to add.'})
      }
    })
    .catch(e => catchError(res, e))
  },
  removeFromWatchlist: (req, res) => {
    db.RemoveFromWishlist(req.body.email, req.body.productId)
    .then(rslt => {
      if (rslt > 0) {
        res.json({ msg: 'Added.', ok: true })
      } else {
        res.json({ msg: 'Failed to add.'})
      }
    })
    .catch(e => catchError(res, e))
  },
  getWatchlist: (req, res) => {
    db.GetWatchlist(req.body.email, req.body.offset, req.body.limit)
    .then(rslt => res.json(rslt))
    .catch(e => catchError)
  },
}