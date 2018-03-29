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

module.exports = {
  getLatestProducts: (req, res) => {
    db.GetLatestProducts(req.query.limit, req.query.offset)
    .then(rslt => {
      ids = rslt.map(r => r._id)
      return db.GetMultipleSpecificProductsInStock(ids)
      .then(async (specifics) => {
        var promotionPrices = await msgBroker.requestPromotionPrices(
          rslt.map(r => r._id))
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
        })
        res.json(rslt)
      })
    })
    .catch(err => catchError(res, err));
  },
  getProduct: (req, res) => {
    db.GetProduct(req.params.id)
    .then(rslt => {
      return db.GetSpecificProductsInStock(rslt._id)
      .then(async specifics => {
        var promotionPrices = await msgBroker.requestPromotionPrices(
          [ rslt._id ])
        if (promotionPrices[0]) {
          rslt.promotionPrice = promotionPrices[0].promotionPrice
        }
        res.json({...rslt, quantity: specifics.specificProducts.length})
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
        var promotionPrices = await msgBroker.requestPromotionPrices(
          rslt.map(r => r._id))
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
        })
        res.json(rslt)
      })
    })
    .catch(err => catchError(res, err));
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
  addNewProduct: (req, res) => {
    typicalResponse(res, db.AddNewProduct(req.body));
  },
  addNewSpecificProducts: (req, res) => {
    typicalResponse(res, db.AddNewSpecificProducts(
      req.body.productId,
      req.body.amount
    ));
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