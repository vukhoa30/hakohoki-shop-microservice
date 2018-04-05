var db = require('./database')
//var helper = require('../helper')
var msgBroker = require('./connection/message-broker')

//chỉ chạy 1 promise
var typicalResponse = (res, func) => {
  func.then(rslt => res.json(rslt))
  .catch(err => catchError(res, err));
}

var catchError = (res, err) => {
  console.log(err)
  res.status(500);
  res.json({ ok: false, msg: 'INTERNAL SERVER ERROR', err: err });
}

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

module.exports = {
  getLatestProducts: (req, res) => {
    db.GetLatestProducts(req.query.limit, req.query.offset)
    .then(rslt => {
      ids = rslt.map(r => r._id)
      return db.GetMultipleSpecificProductsInStock(ids)
      .then(async (specifics) => {
        try {
          var productIds = rslt.map(r => r._id)
          var promotionPrices = await msgBroker.requestPromotionPrices(productIds)
          var reviewScores = await msgBroker.requestReviewScores(productIds)
          rslt.map(r => {
            var item = specifics.find(e => {
              return e._id.toString() == r._id.toString()
            })
            if (!item) { r.quantity = 0 }
            else { r.quantity = item.count }

            item = promotionPrices.find(e => {
              return e.productId.toString() == r._id.toString()
            })
            if (item) { r.promotionPrice = item.promotionPrice }

            item = reviewScores.find(e => 
              e._id.toString() == r._id.toString())
            if (item) {
              r.reviewScore = item.avgScore
              r.reviewCount = item.reviewCount
            }
          })
          res.json(rslt)
        }
        catch(e) { catchError(res, e) }
      })
    })
    .catch(err => catchError(res, err));
  },
  getProduct: (req, res) => {
    db.GetProduct(req.params.id)
    .then(rslt => {
      return db.GetSpecificProductsInStock(rslt._id)
      .then(async specifics => {
        var token, authentication;
        try {
          if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            token = req.headers.authorization.split(' ')[1]
            authentication = await msgBroker.requestAuthenticateCustomer(token)
            if (!authentication) {
              authentication = await msgBroker.requestAuthenticateEmployee(token)
            }
          }
          if (authentication) {
            var watchlists = await msgBroker.requestGetWatchlistUsers([req.params.id])
            console.log(watchlists)
            var findAccountId = watchlists.find(
              w => w.account_id.toString() == authentication.accountId.toString())
            if (findAccountId) {
              rslt.existsInWatchlist = true
            } else { 
              rslt.existsInWatchlist = false
            }
          }


          var promotionPrices = await msgBroker.requestPromotionPrices(
            [ rslt._id ])
          var reviewScores = await msgBroker.requestReviewScores(
            [ rslt._id ])
          if (promotionPrices[0]) {
            rslt.promotionPrice = promotionPrices[0].promotionPrice
          }
          if (reviewScores[0]) {
            rslt.reviewScore = reviewScores[0].avgScore
            rslt.reviewCount = reviewScores[0].reviewCount
          }
          res.json({...rslt, quantity: specifics.specificProducts.length})
        } catch(e) { catchError(res, e) }
      })
    })
    .catch(err => catchError(res, err));
  },
  getProductsByName: (req, res) => {
    db.GetProductsByName(req.query)
    .then(rslt => {
      ids = rslt.map(r => r._id)
      return db.GetMultipleSpecificProductsInStock(ids)
      .then(async specifics => {
        var productIds = rslt.map(r => r._id)
        var promotionPrices = await msgBroker.requestPromotionPrices(productIds)
        var reviewScores = await msgBroker.requestReviewScores(productIds)
        rslt.map(r => {
          var item = specifics.find(e => {
            return e._id.toString() == r._id.toString()
          })
          if (!item) { r.quantity = 0 }
          else { r.quantity = item.count }

          item = promotionPrices.find(e => {
            return e.productId.toString() == r._id.toString()
          })
          if (item) { r.promotionPrice = item.promotionPrice }
          
          item = reviewScores.find(e => 
            e._id.toString() == r._id.toString())
          if (item) {
            r.reviewScore = item.avgScore
            r.reviewCount = item.reviewCount
          }
        })
        res.json(rslt)
      })
    })
    .catch(err => catchError(res, err));
  },
  getProductsByIds: (ids) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        db.GetProductsByIds(ids),
        db.GetMultipleSpecificProductsInStock(ids)
      ])
      .then(async rslts => {
        var [ products, specifics ] = rslts
        var productIds = products.map(r => r._id)
        var promotionPrices = await msgBroker.requestPromotionPrices(productIds)
        var reviewScores = await msgBroker.requestReviewScores(productIds)
        products.map(p => {
          var item = specifics.find(e => {
            return e._id.toString() == p._id.toString()
          })
          if (!item) { p.quantity = 0 }
          else { p.quantity = item.count }
  
          item = promotionPrices.find(e => {
            return e.productId.toString() == p._id.toString()
          })
          if (item) { p.promotionPrice = item.promotionPrice }

          item = reviewScores.find(e => 
            e._id.toString() == p._id.toString())
          if (item) {
            p.reviewScore = item.avgScore
            p.reviewCount = item.reviewCount
          }
        })
        resolve(products)
      })
      .catch(e => { console.log(e); reject(e) })
    })
  },
  getProductsBySpecificIds: (ids) => {
    return new Promise(async (resolve, reject) => {
      try {
        var products = await db.GetProductsBySpecificIds(ids)
        resolve(products.map(p => {
          return {
            productId: p._id,
            productName: p.name
          }
        }))
      } catch(e) { reject(e) }
    })
  },
  getProductBySpecificId: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication) { return catchUnauthorized(res) }
    } catch(e) { catchError(res, e) }

    db.GetProductBySpecificId(req.params.id)
    .then(rslt => {
      return db.GetSpecificProductsInStock(rslt._id)
      .then(async specifics => {
        var promotionPrices = await msgBroker.requestPromotionPrices(
          [ rslt._id ])
        var reviewScores = await msgBroker.requestReviewScores(
          [ rslt._id ])
        if (promotionPrices[0]) {
          rslt.promotionPrice = promotionPrices[0].promotionPrice
        }
        if (reviewScores[0]) {
          rslt.reviewScore = reviewScores[0].avgScore
          rslt.reviewCount = reviewScores[0].reviewCount
        }
        res.json({...rslt, quantity: specifics.specificProducts.length})
      })
    })
    .catch(err => catchError(res, err));
  },
  getGuarantee: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication) { return catchUnauthorized(res) }

      var rslt = await db.GetGuaranteePeriod(req.params.id)
      //stopped
      //var 
      //res.json(rslt)
    } catch(e) { catchError(res, e) }
  },
  getProductsBySpecifications: (req, res) => {
    typicalResponse(res, db.GetProductsBySpecifications(req.params.query, req.body));
  },
  getSpecificProductsInStock: (req, res) => {
    typicalResponse(res, db.GetSpecificProductsInStock(req.params.id));
  },
  getAllCategories: (req, res) => {
    typicalResponse(res, db.GetAllCategories());
  },
  getAllSpecifications: (req, res) => {
    typicalResponse(res, db.GetAllSpecification());
  },
  addNewProduct: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'manager') { return catchUnauthorized(res) }
    
      var rslt = await db.AddNewProduct(req.body)
      res.json(rslt)
    } catch(e) { catchError(res, e) }
  },
  addNewSpecificProducts: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'manager') { return catchUnauthorized(res) }

      var specificProducts = await db.getSpecificProductsInStock(req.body.productId)
      var productQuantity = specificProducts.length
      if (productQuantity == 0) {
        var accountIds = await msgBroker.requestGetWatchlistUsers([req.body.productId])
        var product = await db.getProduct(req.body.productId)
        await msgBroker.requestNotificationRequest(accountIds.map(accountId => {
          return {
            type: 'goodsReceipt',
            accountId,
            productId: req.body.productId,
            productName: product[0].name
          }
        }))
      }
      var rslt = await db.AddNewSpecificProducts(req.body.productId, req.body.amount)

      res.json(rslt)
    } catch(e) { catchError(res, e) }
  },
  sell: (req, res) => {
    typicalResponse(res, db.Sell(req.body.id));
  },
  addCategory: (req, res) => {
    typicalResponse(res, db.AddCategory(req.body.name));
  },
  removeCategory: (req, res) => {
    typicalResponse(res, db.RemoveCategory(req.body.name));
  },
  addSpecification: (req, res) => {
    typicalResponse(res, db.AddSpecification(req.body.specification));
  },
  removeSpecification: (req, res) => {
    typicalResponse(res, db.RemoveSpecification(req.body.name));
  },
  addSpecificationValue: (req, res) => {
    typicalResponse(res, db.AddSpecificationValue(
      req.body.specName,
      req.body.value
    ));
  },
  removeSpecificationValue: (req, res) => {
    typicalResponse(res, db.RemoveSpecificationValue(
      req.body.specName,
      req.body.value
    ));
  },
  alterProduct: (req, res) => {
    typicalResponse(res, db.AlterProduct(
      req.body.id,
      req.body.product
    ));
  }
}