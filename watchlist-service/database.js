var db = require('knex')(require('./config.js').db);
var helper = require('./helper.js')

module.exports = {
  AddToWatchlist: (email, id) => {
    return new Promise((resolve, reject) => {
      db('watchlists')
      .insert({ email, product_id: id })
      .then(rslt => { resolve(rslt) })
      .catch(e => { reject(e) })
    })
  },
  RemoveFromWatchlist: (email, id) => {
    return new Promise((resolve, reject) => {
      db('watchlists')
      .where({ email, product_id: id })
      .del()
      .then(rowCount => { resolve(rowCount) })
      .catch(e => { reject(e) })
    })
  },
  GetWatchlist: (email, offset, limit) => {
    offset = offset || 0;
    limit = limit || 15;
    return new Promise((resolve, reject) => {
      db('watchlists')
      .where({ email })
      .offset(offset)
      .limit(limit)
      .then(rows => { resolve(rows) })
      .catch(e => { reject(e) })
    })
  }
}
