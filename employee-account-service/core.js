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

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

var checkManager = (req) => { //resovle true or false
  return new Promise((resolve, reject) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      var token = req.headers.authorization.split(' ')[1]
      helper.verifyjwt(token)
      .then(decode => {
        console.log(decode)
        resolve(decode.role === 'manager')
      })
      .catch(e => resolve(false))
    }
  })
}

module.exports = {
  createAccount: async (req, res) => {
    if (req.body.password.length < 6) {
      return res.json({ ok: false, msg: 'Sign up failed. Password length mustn\'t < 6.' });
    }
    if (!(await checkManager(req))) {
      return catchUnauthorized(res)
    }
    req.body.hashed_password = helper.hashPassword(req.body.password);
    delete req.body.password;
    db.CreateAccount(req.body)
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
          role: account.role,
          accountId: account.id,
          expireTime: helper.generateExpireTime()
        }),
        account: {
          accountId: account.id,
          email: account.email,
          role: account.role,
          fullName: account.full_name,
          phoneNumber: account.phone_number
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
      if (decode.email && decode.email === req.body.email && 
        Date.now() < decode.expireTime) {
        res.json({ ok: true, decodeToken })
      } else {
        res.json({ ok: false })
      }
    })
    .catch(e => catchError(res, e))
  },
  authenticateEmployee: (token) => {
    return new Promise((resolve, reject) => {
      helper.verifyjwt(token)
      .then(decode => {
        resolve({
          accountId: decode.accountId,
          role: decode.role
        })
      })
      .catch(e => reject(e))
    })
  },
  deactiveAccount: async (req, res) => {
    if (!(await checkManager(req))) {
      return catchUnauthorized(res)
    }
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
  reactiveAccount: async (req, res) => {
    if (!(await checkManager(req))) {
      return catchUnauthorized(res)
    }
    db.ReactiveAccount(req.body.email)
    .then(rowCount => {
      if (rowCount > 0) {
        res.json({ ok: true, msg: 'Account reactivated.'})
      } else {
        res.json({ ok: false, msg: 'Account failed to be reactivated.' })
      }
    })
    .catch(e => catchError(res, e))
  },
  checkReceptionist: (req, res, next) => {
    if (req.account && req.account.role == 'receptionist') {
      next()
    } else {
      res.status(403);
      res.json({ msg: 'No receptionist privilege!' });
    }
  },
  checkManager: (req, res, next) => {
    if (req.account && req.account.role == 'manager') {
      next()
    } else {
      res.status(403);
      res.json({ msg: 'No manager privilege!' });
    }
  },


  /*
  getProduct: (req, res) => {
    typicalResponse(res, db.GetProduct(req.params.id));
  },*/
}