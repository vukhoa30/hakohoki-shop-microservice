var mongoose = require('mongoose');
var config = require('./config.js')

var defaultLimit = config.defaultLimit;
var dbAddress = config.dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

var parseRslt = (rslts) => { 
  return rslts.map(rslt => { 
    return {
      "additionPicture": rslt.additionalPicture,
      "addedAt": rslt.addedAt,
      "_id": rslt._id,
      "mainPicture": rslt.mainPicture,
      "category": rslt.category,
      "name": rslt.name,
      "description": rslt.description,
      "price": rslt.price,
      "guarantee": rslt.guarantee,
      "specifications": rslt.specifications
    }
  }
)}

module.exports = {
  GetLatestProducts: (limit, offset) => {
    limit = parseInt(limit) || config.defaultLimit
    offset = parseInt(offset) || 0
    return new Promise((resolve, reject) => {
      models.Product
      .find()
      .sort({ 'addedAt': -1 })
      .limit(limit)
      .skip(offset)
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(parseRslt(rslt));
      })
    })
  },
  GetProduct: (id) => {
    return new Promise((resolve, reject) => {
      models.Product
      .find({
        _id: id
      })
      .exec((err, rslt) => {
        if (err) reject(err);
        if (rslt.length < 1) reject({msg: 'product not found'});
        else resolve(parseRslt(rslt)[0]);
      })
    })
  },
  GetProductsByName: (query) => {
    query.limit = parseInt(query.limit) || defaultLimit
    query.offset = parseInt(query.offset) || 0
    var queryObject = query.q ? {
      $text: {
        $search: query.q
      }
    } : {}
    if (query.category) {
      queryObject.category = query.category
    }
    Object.getOwnPropertyNames(query).map(name => {
      if (name !== 'q' && name !=='limit' && name !== 'offset' && name !== 'category') {
        queryObject[`specifications.${name}`] = query[`${name}`]
      }
    })
    //https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
    return new Promise((resolve, reject) => {
      models.Product
      .find(queryObject)
      .skip(query.offset)
      .limit(query.limit)
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(parseRslt(rslt));
      })
    })
  },
  GetProductsBySpecifications: (queryString, specs) => {
    return new Promise((resolve, reject) => {
      models.Product.find({
        $text: {
          $search: queryString
        }
      }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt.filter(product => {
          return Object.keys(specs).map(key => {
            product[key] === specs[key]
          }).length === Object.keys(specs).length
        }));
      })
    })
  },
  GetSpecificProductsInStock: (id) => {
    return new Promise((resolve, reject) => {
      models.SpecificProduct
      .find({
        productId: id,
        status: 'inStock'
      })
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve({
          productId: id,
          status: 'instock',
          specificProducts: rslt.map(item => { return {
            addedAt: item.addedAt,
            id: item._id
          }})
        });
      })
    })
  },
  GetMultipleSpecificProductsInStock: (ids) => {
    return new Promise((resolve, reject) => {
      ids = ids.map(i => mongoose.Types.ObjectId(i))
      models.SpecificProduct.aggregate([
        {
          $match: {
            productId: {$in: ids}
          }
        },
        {
          $group: {
            _id: '$productId',
            count: {$sum: 1}
          }
        }
      ], (err, rslt) => {
        if (err) { reject(err) }
        else { 
          //resolve(rslt.filter(r => ids.indexOf(r._id.toString()) >= 0)) 
          resolve(rslt)
        }
      })
    })
  },
  GetProductBySpecificId: (id) => {
    return new Promise(async (resolve, reject) => {
      models.SpecificProduct
      .find({_id: id})
      .exec((err, rslt) => {
        if (err || rslt.length == 0) { return reject({msg: 'not found', err}) }
        models.Product
        .find({_id: rslt[0].productId})
        .exec((err2, products) => {
          if (err2) { return reject(err2) }
          var product = parseRslt(products)[0]
          resolve({...product, specificId: id})
        })
      })
    })
  },
  GetProductsBySpecificIds: (ids) => {
    return new Promise(async (resolve, reject) => {
      models.SpecificProduct
      .find({_id: {$in: ids.map(id => mongoose.Types.ObjectId(id))}})
      .exec((err, rslt) => {
        if (err || rslt.length == 0) { return reject({msg: 'not found', err}) }
        models.Product
        .find({_id: {$in: rslt.map(r => r.productId)}})
        .exec((err2, products) => {
          if (err2) { return reject(err2) }
          resolve(parseRslt(products))
        })
      })
    })
  },
  AddNewProduct: (product) => {
    return new Promise((resolve, reject) => {
      var newProduct = new models.Product(product);
      newProduct.save((err, rslt) => {
        if (err) reject(err);
        else resolve({ id: rslt._id });
      })
    })
  },
  AddNewSpecificProducts: (id, amount) => {
    return new Promise((resolve, reject) => {
      var specificProducts = [];
      for (var i = 0; i < amount; i++) {
        specificProducts.push({
          productId: id
        })
      }
      models.SpecificProduct
      .insertMany(specificProducts, (err, rslt) => {
        if (err) reject(err);
        else {
          resolve({
            productId: id,
            specificProducts: rslt.map(item => { return {
              id: item._id,
              status: item.status
            }})
          });
        }
      })
    })
  },
  Sell: (id) => {
    return new Promise((resolve, reject) => {
      models.Product
      .update({ _id: id }, {
        $set: {
          status: 'sold'
        }
      }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AddCategory: (name) => {
    return new Promise((resolve, reject) => {
      var newCategory = new models.Category({ name });
      newCategory.save((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  RemoveCategory: (name) => {
    return new Promise((resolve, reject) => {
      models.Category.remove({ name }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AddSpecification: (specification) => {
    specification.values = [];
    return new Promise((resolve, reject) => {
      var newSpecification = new models.Specification(specification);
      newSpecification.save((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  RemoveSpecification: (name) => {
    return new Promise((resolve, reject) => {
      models.Specification.remove({ name }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AddSpecificationValue: (specName, value) => {
    return new Promise((resolve, reject) => {
      models.Specification.update({ name: specName }, {
        $push: { values: value }
      }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  RemoveSpecificationValue: (specName, value) => {
    return new Promise((resolve, reject) => {
      models.Specification.update({ name: specName }, {
        $pullAll: { values: [ value ] }
      }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AlterProduct: (id, product) => {
    return new Promise((resolve, reject) => {
      models.Product.update({ _id: id }, {
        $set: {
          mainPicture: product.mainPicture,
          additionalPictures: product.additionalPictures,
          category: product.category,
          name: product.name,
          description: product.description,
          specification: product.specification
        }
      }, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  GetAllSpecification: () => {
    return new Promise((resolve, reject) => {
      models.Specification
      .find({}, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  GetAllCategories: () => {
    return new Promise((resolve, reject) => {
      models.Category
      .find({}, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt.map(item => item.name));
      })
    })
  },
  GetProductsByIds: (ids) => {
    return new Promise((resolve, reject) => {
      models.Product
      .find({_id: {$in: ids}})
      .exec((err, rslt) => {
        if (err) { return reject(err) }
        resolve(parseRslt(rslt))
      })
    })
  },
  UpdateSpecificsStatus: (ids) => {
    return new Promise((resolve, reject) => {
      models.SpecificProduct
      .updateMany({_id: {$in: ids}}, {
        $set: { status: 'sold' }
      }, (err, rslt) => {
        if (err) { return reject(err) }
        resolve(rslt)
      })
    })
  },
  GetGuaranteePeriod: (specificId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var productID = await 
          models.SpecificProduct.find({_id: specificId}).productId
        var months = await
          models.Product.find({_id: productID})._id
        resolve(months)
      } catch(e) {reject(e)}
    })
  }
}
