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
  createAccount: (req, res) => {
    if (req.body.account.password.length < 6) {
      return res.json({ ok: false, msg: 'Sign up failed. Password length mustn\'t < 6.' });
    }
    req.body.account.hashed_password = helper.hashPassword(req.body.account.password);
    delete req.body.account.password;
    db.CreateAccount(req.body.account)
    .then(rslt => {
      if (rslt.rowCount > 0) {
        res.json({ ok: true, msg: 'Sign up succeed.' });
      } else {
        res.json({ ok: false, msg: 'Sign up failed.' });
      }
    })
    .catch(e => catchError(res, e))
  },
  logIn: (req, res) => {
    db.LogIn(req.body.email, req.body.password)
    .then(account => {
      res.json({
        token: helper.signjwt({
          email: account.email,
          role: account.role
        }),
        account: {
          email: account.email,
          role: account.role
        }
      })
    })
    .catch(e => catchError(res, e))
  },
  changePassword: (req, res) => {
    db.ChangePassword(req.body.email, req.body.oldPassword, req.body.newPassword)
    .then(rowCount => {
      if (rowCount > 0) {
        res.json({ ok: true, msg: 'Password changed.' })
      } else {
        res.json({ ok: false, msg: 'Password failed to be changed.' })
      }
    })
    .catch(e => catchError(res, e))
  },
  authenticate: (req, res) => {
    helper.verifyjwt(req.body.token)
    .then(decode => {
      if (decode.email && decode.email === req.body.email) {
        res.json({ ok: true })
      } else {
        res.json({ ok: false })
      }
    })
    .catch(e => catchError(res, e))
  },
  deactiveAccount: (req, res) => {
    db.DeactiveAccount(req.body.email)
    .then(rowCount => {
      if (rowCount > 0) {
        res.json({ ok: true, msg: 'Account deactivated.'})
      } else {
        res.json({ ok: false, msg: 'Account failed to be deactivated.' })
      }
    })
    .catch(e => catchError(res, e))
  },
  reactiveAccount: (req, res) => {
    db.ReactiveAccount(req.body.email)
    .then(rowCount => {
      if (rowCount > 0) {
        res.json({ ok: true, msg: 'Account reactivated.'})
      } else {
        res.json({ ok: false, msg: 'Account failed to be reactivated.' })
      }
    })
    .catch(e => catchError(res, e))
  }

  /*
  getProduct: (req, res) => {
    typicalResponse(res, db.GetProduct(req.params.id));
  },*/
}