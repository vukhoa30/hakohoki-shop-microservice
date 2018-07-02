var config = require('./config')
var db = require('knex')(config.db)
var defaultLimit = config.defaultLimit

module.exports = {
  AddToWatchlist: (account_id, product_id) => {
    return new Promise((resolve, reject) => {
      db('watchlists')
      .insert({ account_id, product_id })
      .then(rslt => { resolve(rslt) })
      .catch(e => { reject(e) })
    })
  },
  RemoveFromWatchlist: (account_id, product_id) => {
    return new Promise((resolve, reject) => {
      db('watchlists')
      .where({ account_id, product_id })
      .del()
      .then(rowCount => { resolve(rowCount) })
      .catch(e => { reject(e) })
    })
  },
  GetWatchlist: (account_id, limit, offset) => {
    offset = offset || 0;
    limit = limit || defaultLimit;
    return new Promise((resolve, reject) => {
      db('watchlists')
      .where({ account_id })
      .offset(offset)
      .limit(limit)
      .then(rows => { 
        console.log(rows);resolve(rows.map(r => r.product_id)) })
      .catch(e => { reject(e) })
    })
  },
  GetWatchlistUsers: (productIds) => {
    return new Promise((resolve, reject) => {
      db('watchlists')
      .whereRaw('product_id = any(?)', [productIds])
      .then(rows => { resolve(rows.map(r => {
        return {
          productId: r.product_id,
          accountId: r.account_id
        }
      })) })
      .catch(e => { reject(e) })
    })
  }
}
