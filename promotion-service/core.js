var redis = require('redis')
var db = require('./database')
var helper = require('./helper.js')
var msgBroker = require('./connection/message-broker')

var redisConnection = require('./config.js').redisConnection
var client = redis.createClient(redisConnection)

const CACHE_CURRENT_PROMOTION = 'currentPromotion'

var catchError = (res, err) => {
  console.log(err)
  res.status(500);
  res.json({ msg: 'INTERNAL SERVER ERROR', err: err });
}

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

module.exports = {
  createPromotion: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'manager') { 
        return catchUnauthorized(res)
      }

      var promotionId = await db.CreatePromotion(req.body)
      var allCustomers
      if (req.body.sendNotification || req.body.sendEmail) {
        allCustomers = await msgBroker.requestGetAllCustomers()
        if (req.body.sendNotification) {
          msgBroker.produceNotificationRequest(
            allCustomers.map(customer => {
              return {
                type: 'promotionCreated',
                accountId: customer.accountId,
                promotionId,
                promotionName: req.body.name
              }
            })
          )
        }
        if (req.body.sendEmail) {
          msgBroker.produceEmailRequest(
            allCustomers.map(customer => {
              return {
                type: 'promotionCreated',
                email: customer.email,
                promotionName: req.body.name
              }
            })
          )
        }
      }

      res.json({ok: true})
    } catch (e) { return catchError(res, e) }
  },
  cacheCurrentPromotions: (req, res, next) => {
    client.get(CACHE_CURRENT_PROMOTION, (err, data) => {
      if (data != null) {
        console.log('cache taken')
        res.json(JSON.parse(data));
      } else {
        next();
      }
    })
  },
  getCurrentPromotions: (req, res) => {
    db.GetCurrentPromotions()
    .then(async rslt => {
      var { promotions, products } = rslt
      console.log(products)
      var productsInfo = await msgBroker.requestGetProducts(rslt.products.map(p => p.product_id))
      console.log(productsInfo)
      promotions.forEach(p => { p.products = [] });

      productsInfo.forEach(p => {
        var idx = promotions.findIndex(e => {
          var productFinder = products.find(i => 
            p._id.toString() == i.product_id.toString())
          return productFinder.promotion_id === e.id
        })
        promotions[idx].products.push(p)
      })

      client.setex(CACHE_CURRENT_PROMOTION, 10, JSON.stringify(rslt));
      res.json(promotions);
    })
    .catch(e => catchError(res, e))
  }
}