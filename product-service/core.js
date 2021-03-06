var db = require('./database')
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
      var ids = rslt.map(r => r._id)
      return db.GetMultipleSpecificProducts(ids, 'inStock')
      .then(async (specifics) => {
        try {
          var productIds = rslt.map(r => r._id)
          var promotionInfos = await msgBroker.requestPromotionInfos(productIds)
          if (!promotionInfos) { promotionInfos = [] }
          var giftIds = promotionInfos.filter(i => i.giftId).map(i => i.giftId)
          var gifts = await db.GetProductsByIds(giftIds)
          var reviewScores = await msgBroker.requestReviewScores(productIds)
          if (!reviewScores) { reviewScores = [] }
          var specificsSold = await db.GetMultipleSpecificProducts(ids, 'sold')
          rslt.map(r => {
            var item = specifics.find(e => {
              return e._id.toString() == r._id.toString()
            })
            if (!item) { r.quantity = 0 }
            else { r.quantity = item.count }

            item = specificsSold.find(e => {
              return e._id.toString() == r._id.toString()
            })
            if (item) { r.sold5OrOver = item.count >= 5 }
            else { r.sold5OrOver = false }

            var items = promotionInfos.filter(e => {
              return e.productId.toString() == r._id.toString()
            })
            if (items.length > 0) { 
              r.promotionPrice = items[0].promotionPrice 
              items.map(i => {
                if (i.giftId) {
                  var gift = gifts.find(g => 
                    g._id.toString() == i.giftId.toString())
                  if (!r.giftProducts) {
                    r.giftProducts = [ gift ]
                  } else {
                    r.giftProducts.push(gift)
                  }
                }
              })
            }

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
            var findAccountId = watchlists.find(
              w => w.accountId.toString() == authentication.accountId.toString())
            if (findAccountId) {
              rslt.existsInWatchlist = true
            } else { 
              rslt.existsInWatchlist = false
            }

            rslt.reviewedBySelf = await msgBroker.requestCheckReviewed({
              accountId: authentication.accountId,
              productId: req.params.id
            })
          }

          var specificsSold = await db.GetSpecificProductsSold(req.params.id)
          rslt.sold5OrOver = specificsSold.specificProducts.length >= 5

          var promotionInfos = await msgBroker.requestPromotionInfos(
            [ rslt._id ])
          if (!promotionInfos) { promotionInfos = [] }
          var gifts = await db.GetProductsByIds(promotionInfos
            .filter(p => p.giftId).map(p => p.giftId))
          var reviewScores = await msgBroker.requestReviewScores(
            [ rslt._id ])
          if (!reviewScores) { reviewScores = [] }
          if (promotionInfos.length > 0) {
            rslt.promotionPrice = promotionInfos[0].promotionPrice
            rslt.giftProducts = gifts
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
      var ids = rslt.map(r => r._id)
      return db.GetMultipleSpecificProducts(ids, 'inStock')
      .then(async specifics => {
        var productIds = rslt.map(r => r._id)
        var promotionInfos = await msgBroker.requestPromotionInfos(productIds)
        if (!promotionInfos) { promotionInfos = [] }
        var gifts = await db.GetProductsByIds(promotionInfos
          .filter(p => p.giftId).map(p => p.giftId))
        var reviewScores = await msgBroker.requestReviewScores(productIds)
        if (!reviewScores) { reviewScores = [] }
        var specificsSold = await db.GetMultipleSpecificProducts(ids, 'sold')
        rslt.map(r => {
          var item = specifics.find(e => {
            return e._id.toString() == r._id.toString()
          })
          if (!item) { r.quantity = 0 }
          else { r.quantity = item.count }

          item = specificsSold.find(e => {
            return e._id.toString() == r._id.toString()
          })
          if (item) { r.sold5OrOver = item.count >= 5 }
          else { r.sold5OrOver = false }

          var items = promotionInfos.filter(e => {
            return e.productId.toString() == r._id.toString()
          })
          if (items.length > 0) { 
            r.promotionPrice = items[0].promotionPrice 
            items.map(i => {
              if (i.giftId) {
                var gift = gifts.find(g => 
                  g._id.toString() == i.giftId.toString())
                if (!r.giftProducts) {
                  r.giftProducts = [ gift ]
                } else {
                  r.giftProducts.push(gift)
                }
              }
            })
          }
          
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
        db.GetMultipleSpecificProducts(ids, 'inStock')
      ])
      .then(async rslts => {
        var [ products, specifics ] = rslts
        var productIds = products.map(r => r._id)
        var promotionInfos = await msgBroker.requestPromotionInfos(productIds)
        if (!promotionInfos) { promotionInfos = [] }
        var gifts = await db.GetProductsByIds(promotionInfos
          .filter(p => p.giftId).map(p => p.giftId))
        var reviewScores = await msgBroker.requestReviewScores(productIds)
        if (!reviewScores) { reviewScores = [] }
        products.map(p => {
          var item = specifics.find(e => {
            return e._id.toString() == p._id.toString()
          })
          if (!item) { p.quantity = 0 }
          else { p.quantity = item.count }
  
          var items = promotionInfos.filter(e => {
            return e.productId.toString() == p._id.toString()
          })
          if (items.length > 0) { 
            p.promotionPrice = items[0].promotionPrice 
            items.map(i => {
              if (i.giftId) {
                var gift = gifts.find(g => 
                  g._id.toString() == i.giftId.toString())
                if (!p.giftProducts) {
                  p.giftProducts = [ gift ]
                } else {
                  p.giftProducts.push(gift)
                }
              }
            })
          }

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
        var specifics = await db.GetMultipleSpecificProducts(products.map(p =>
          p._id), 'inStock')
        products.map(p => {
          var item = specifics.find(e => 
            e._id.toString() == p._id.toString())
          if (!item) { p.quantity = 0}
          else {p.quantity = item.count}
        });
        resolve(products.map(p => {
          return {
            productId: p._id,
            productName: p.name,
            productQuantity: p.quantity
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
        var promotionInfos = await msgBroker.requestPromotionInfos(
          [ rslt._id ])
        if (!promotionInfos) { promotionInfos = [] }
        var gifts = await db.GetProductsByIds(promotionInfos
          .filter(p => p.giftId).map(p => p.giftId))
        var reviewScores = await msgBroker.requestReviewScores(
          [ rslt._id ])
        if (!reviewScores) { reviewScores = [] }
        if (promotionInfos.length > 0) {
          rslt.promotionPrice = promotionInfos[0].promotionPrice
          rslt.giftProducts = gifts
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

      var specificProducts = await db.GetSpecificProductsInStock(req.body.productId)
      var productQuantity = specificProducts.specificProducts.length
      if (productQuantity == 0) {
        var watchlistUsers = await msgBroker.requestGetWatchlistUsers([req.body.productId])
        if (!watchlistUsers) { watchlistUsers = [] }
        var product = await db.GetProduct(req.body.productId)
        msgBroker.produceNotificationRequest(watchlistUsers.map(watchlistUser => {
          return {
            type: 'goodsReceipt',
            accountId: watchlistUser.accountId,
            productId: req.body.productId,
            productName: product.name
          }
        }))

        var customers = await msgBroker.requestCustomers(watchlistUsers.map(i =>
          i.accountId))
        watchlistUsers.map(i => {
          var finder = customers.find(c => 
            c.accountId.toString() == i.accountId.toString())
          i.email = finder.email
        })
        msgBroker.produceEmailRequest(watchlistUsers.map(i => {
          return {
            type: 'goodsReceipt',
            email: i.email,
            productName: product.name
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
  },
  getPendingProducts: async (productIdsAndAmounts) => {
    try {
      var products = await db.GetProductsByIds(productIdsAndAmounts.map(i => 
        i.productId))
      var promotionInfos = await msgBroker.requestPromotionInfos(products.map(p =>
        p._id))
      promotionInfos = promotionInfos ? promotionInfos : []
      var gifts = await db.GetProductsByIds(promotionInfos
        .filter(p => p.giftId).map(p => p.giftId))
      gifts = gifts ? gifts : []
      products.map(r => {
        var items = promotionInfos.filter(e => {
          return e.productId.toString() == r._id.toString()
        })
        if (items.length > 0) { 
          r.promotionPrice = items[0].promotionPrice 
          items.map(i => {
            if (i.giftId) {
              var gift = gifts.find(g => 
                g._id.toString() == i.giftId.toString())
              if (!r.giftProducts) { r.giftProducts = [ ] } 
              r.giftProducts.push(gift)
            }
          })
        }
      })
      var specifics = await db
        .GetPendingProducts(productIdsAndAmounts)
      if (!specifics) { return false }

      specifics.forEach(s => {
        var finder = products.find(p => 
          p._id.toString() == s.productId.toString())
        s.price = finder.promotionPrice ? finder.promotionPrice : finder.price
      });
      
      return specifics
    } catch(e) { console.log(e); return false }
  },
  getSpecificInfos: async (specificIds) => {
    try {
      var specifics = await db.GetSpecificProductsByIds(specificIds)
      var products = await db.GetProductsByIds(specifics.map(s => s.productId))
      specifics.map(s => {
        var finder = products.find(p => 
          p._id.toString() == s.productId.toString())
        s.productName = finder.name
        s.mainPicture = finder.mainPicture
        s.productId = finder._id
        s.category = finder.category
      })
      return specifics
    } catch(e) { console.log(e); return false }
  }
}