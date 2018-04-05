var db = require('knex')(require('./config.js').db);
var helper = require('./helper.js')

module.exports = {
  CreatePromotion: (promotion) => {
    return new Promise((resolve, reject) => {
      db('promotions')
      .insert({
        start_at: promotion.start,
        end_at: promotion.end,
        name: promotion.name
      })
      .returning('id')
      .then(id => {
        return db('products').insert(
          promotion.products.map(product => {
            product.promotion_id = id[0];
            return product;
          })
        ).then(rslt => {
          resolve(id[0])
        })
      })
      .catch(e => { console.log(e);reject(e) });
    })
  },
  GetCurrentPromotion: () => {
    return new Promise((resolve, reject) => {
      db({ a: 'promotions', b: 'products' })
      .select({
        aid: 'a.id',
        bpromotion_id: 'b.promotion_id',
        bproduct_id: 'b.product_id',
        astart: 'a.start_at',
        aend: 'a.end_at',
        aname: 'a.name',
        bnew_price: 'b.new_price'
      })
      .whereRaw('?? = ?? and CURRENT_TIMESTAMP >= ?? and CURRENT_TIMESTAMP <= ??', 
        [ 'a.id', 'b.promotion_id', 'a.start_at', 'a.end_at' ])
      .then(rows => {
        if (rows.length === 0) { resolve({ msg: 'No currently promotion.' }); }
        else { resolve({
          start: rows[0].astart,
          end: rows[0].aend,
          name: rows[0].aname,
          products: rows.map(row => { return {
            newPrice: row.bnew_price,
            id: row.bproduct_id
          }})
        })}
      })
      .catch(e => { reject(e) })
    })
  },
  GetPromotionPrices: (ids) => {
    return new Promise((resolve, reject) => {
      db({ a: 'promotions', b: 'products' })
      .select({
        bproduct_id: 'b.product_id',
        bnew_price: 'b.new_price'
      })
      .whereRaw('?? = ?? and ?? = any(?) and CURRENT_TIMESTAMP >= ?? and CURRENT_TIMESTAMP <= ??', [
        'a.id', 'b.promotion_id',
        'b.product_id', ids,
        'a.start_at', 'a.end_at'
      ])
      .then(rows => {
        if (rows.length === 0) { reject({ new: false }) }
        else { 
          resolve(rows.map(row => { 
          return {
            productId: row.bproduct_id,
            promotionPrice: row.bnew_price
          }}
        ))}
      })
      .catch(e => { reject(e) })
    })
  },
}
