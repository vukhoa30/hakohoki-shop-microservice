var db = require('knex')(require('./config.js').db);
var helper = require('./helper.js')

module.exports = {
  CreatePromotion: (promotion) => {
    return new Promise((resolve, reject) => {
      db('promotions')
      .insert({
        start_at: promotion.start,
        end_at: promotion.end,
        name: promotion.name,
        poster_url: promotion.posterUrl
      })
      .returning('id')
      .then(id => {
        return db('products_prices').insert(
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
  GetCurrentPromotions: () => {
    return new Promise(async (resolve, reject) => {
      try {
        var promotions = await db('promotions')
          .whereRaw('CURRENT_TIMESTAMP >= ?? and CURRENT_TIMESTAMP <= ??',
            ['start_at', 'end_at'])
        var products = await db('products_prices')
          .whereRaw('?? = any(?)',
            ['promotion_id', promotions.map(p => p.id)])
        
        resolve({promotions, products})
      } catch(e) { console.log(e); reject(e); }
    })
  },
  GetPromotionPrices: (ids) => {
    return new Promise((resolve, reject) => {
      db({ a: 'promotions', b: 'products_prices' })
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
  GetPromotions: (promotionIds) => {
    return new Promise((resolve, reject) => {
      db('promotions')
      .whereRaw('id = any(?)', [ promotionIds ])
      .then(rows => resolve(rows))
      .catch(e => { reject(e) })
    })
  }
}
