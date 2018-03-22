var db = require('knex')(require('./config.js').db);
var helper = require('./helper.js')

module.exports = {
  CreateAccount: (account) => {
    return new Promise((resolve, reject) => {
      db('accounts').insert({
        ...account,
        active: true,
        created_at: new Date()
      })
      .then(rslt => { resolve(rslt); })
      .catch(e => { reject(e); })
    })
  },
  DeactiveAccount: (email) => {
    return new Promise((resolve, reject) => {
      db('accounts')
      .where({ email })
      .update({ active: false })
      .then(rslt => { resolve(rslt); })
      .catch(e => { reject(e); })
    })
  },
  ReactiveAccount: (email) => {
    return new Promise((resolve, reject) => {
      db('accounts')
      .where({ email })
      .update({ active: true })
      .then(rslt => { resolve(rslt); })
      .catch(e => { reject(e); })
    })
  },
  LogIn: (email, password) => {
    return new Promise((resolve, reject) => {
      db('accounts')
      .where({ email })
      .then(rows => {
        if (rows.length > 0 && helper.comparePassword(password, rows[0].hashed_password)) {
          if (rows[0].active) {
            resolve(rows[0]);
          } else {
            reject({ msg: 'Account deactivated.' })
          }
        }
        else {
          reject({ msg: 'Login failed!' })
        }
      })
      .catch(e => { reject({ msg: 'Login failed!' }); })
    })
  },
  ChangePassword: (email, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      db('accounts')
      .where({ email })
      .then(rows => {
        if (rows.length > 0 && helper.comparePassword(oldPassword, rows[0].hashed_password)) {
          db('accounts')
          .update({ hashed_password: helper.hashPassword(newPassword) })
          .then(rslt => {
            resolve(rslt);
          })
        }
        else {
          reject({ msg: 'Old password mismatched.' })
        }
      })
      .catch(e => { reject({ msg: 'Login failed!' }); })
    })
  }
}
