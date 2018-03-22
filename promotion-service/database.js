var db = require('knex')(require('./config.js').db);
var helper = require('./helper.js')

module.exports = {
  CreatePromotion: (promotion) => {
    return new Promise((resolve, reject) => {
      db('promotions')
      .insert({
        start: promotion.start,
        end: promotion.end,
        name: promotion.name
      })
      .then(rslt => {
        return db('products').insert(
          promotion.products.map(product => {
            product.promotion_id = rslt.id;
            return product;
          })
        )
      })
      .then(rslt => { resolve(rslt) })
      .catch(e => { reject(e) });
    })
  },
  GetCurrentPromotion: () => {
    return new Promise((resolve, reject) => {
      db({ a: 'promotions', b: 'products' })
      .select({
        aid: 'a.id',
        bpromotion_id: 'b.promotion_id',
        bproductid_id: 'b.product_id',
        astart: 'a.start_at',
        aend: 'a.end_at',
        aname: 'a.name',
        bnew_price: 'b.new_price'
      })
      .whereRaw('?? = ?? and CURRENT_TIMESTAMP >= ?? and CURRENT_TIMESTAMP <= ??', [
        'a.id', 'b.promotion_id', 'a.start_at', 'a.end_at'
      ])
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
  GetNewPrices: (ids) => {
    return new Promise((resolve, reject) => {
      db({ a: 'promotions', b: 'products' })
      .select({
        bproduct_id: 'b.product_id',
        bnew_price: 'b.new_price'
      })
      .whereRaw('?? = ?? and ?? = any(??) and ?? >= ?? and ?? <= ??', [
        'a.id', 'b.promotion_id',
        'b.product_id', ids,
        new Date(), 'a.start',
        new Date(), 'a.end'
      ])
      .then(rows => {
        if (rows.length === 0) { reject({ new: false }) }
        else { resolve({ 
          new: true, 
          newPrices: rows.map(row => { return {
            productId: row.bproduct_id,
            newPrice: row.bnew_price
          }}) 
        })}
      })
      .catch(e => { reject(e) })
    })
  },
}
