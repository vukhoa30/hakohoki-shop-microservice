var config = require('./config')
var db = require('knex')(config.db)
var defaultLimit = config.defaultLimit

module.exports = {
  GetCart: (account_id) => {
    return new Promise((resolve, reject) => {
      db('carts')
      .where({ account_id })
      .then(rows => {
        resolve(rows.map(row => { return {
          productId: row.product_id, amount: row.amount 
        }}))
      })
      .catch(e => reject(e))
    })
  },
  AddToCart: (account_id, product_id, amount) => {
    return new Promise((resolve, reject) => {
      db('carts')
      .insert({ account_id, product_id, amount: amount ? amount : 1 })
      .then(rslt => resolve(rslt))
      .catch(e => reject(e))
    })
  },
  UpdateAmount: (account_id, product_id, amount) => {
    return new Promise((resolve, reject) => {
      db('carts')
      .where({ account_id, product_id })
      .update({ amount })
      .then(rowCount => resolve(rowCount))
      .catch(e => reject(e))
    })
  },
  RemoveFromCart: (account_id, product_id) => {
    return new Promise((resolve, reject) => {
      db('carts')
      .where({ account_id, product_id })
      .del()
      .then(rowCount => resolve(rowCount))
      .catch(e => reject(e))
    })
  },
  ClearCart: (account_id) => {
    return new Promise((resolve, reject) => {
      db('carts')
      .where({ account_id })
      .del()
      .then(rowCount => resolve(rowCount))
      .catch(e => reject(e))
    })
  }
}
