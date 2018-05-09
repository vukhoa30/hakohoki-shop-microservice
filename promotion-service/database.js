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
          promotion.products
          .filter(product => product.new_price)
          .map(product => {
            return {
              promotion_id: id[0],
              product_id: product.product_id,
              new_price: product.new_price
            }
          })
        )
        .then(() => {
          var gifts = []
          promotion.products.forEach(product => {
            if (product.gift_ids) {
              product.gift_ids.forEach(giftId => {
                gifts.push({
                  promotion_id: id[0],
                  product_id: product.product_id,
                  gift_id: giftId
                })
              })
            }
          });
          resolve(id[0])
          return db('products_gifts').insert(gifts)
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
  GetPromotionInfos: (productIds) => {
    return new Promise((resolve, reject) => {
      db('promotions as p')
      .whereRaw('pp.product_id = ANY(?) and CURRENT_TIMESTAMP >= ?? and CURRENT_TIMESTAMP <= ??', 
        [ productIds, 'start_at', 'end_at' ])
      .leftJoin('products_prices as pp', 'p.id', 'pp.promotion_id')
      .leftJoin('products_gifts as pg', (q) => {
        q.on('pg.promotion_id', '=', 'p.id')
          .andOn('pg.product_id', '=', 'pp.product_id')
      })
      .select('p.id', 'pp.product_id as product_id',
        'pp.new_price as new_price', 'pg.gift_id')
      .then(rows => {
        if (rows.length === 0) { return reject(false) }
        resolve(rows.map(row => { 
          return {
            productId: row.product_id,
            promotionPrice: row.new_price,
            giftId: row.gift_id
          }
        }))
      })
      .catch(e => { return reject(e) })
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
