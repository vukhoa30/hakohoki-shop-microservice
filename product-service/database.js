var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

module.exports = {
  GetLatestProducts: () => {
    return new Promise((resolve, reject) => {
      models.Product
      .find()
      .sort({ 'addedAt': -1 })
      .limit(10)
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
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
        else resolve(rslt);
      })
    })
  },
  GetProductsByName: (queryString) => {
    //https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
    return new Promise((resolve, reject) => {
      models.Product
      .find({
        $text: {
          $search: queryString
        }
      })
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
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
  GetNumberOfProductsInStock: (id) => {
    return new Promise((resolve, reject) => {
      models.Product
      .count({
        productId: id,
        status: 'inStock'
      })
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AddNewProduct: (product) => {
    return new Promise((resolve, reject) => {
      var newProduct = new models.Product(product);
      newProduct.save((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  },
  AddNewSpecificProducts: (id, amount) => {
    return new Promise((resolve, reject) => {
      var specificProducts = [];
      for (var i = 0; i < amount; i++) {
        specificProducts.push({
          productId: id,
          addedAt: Date.now(),
          status: 'inStock'
        })
      }
      models.Product
      .insertMany(specificProducts, (err, rslt) => {
        if (err) reject(err);
        else resolve(rslt.map(item => item._id));
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
        else resolve(rslt);
      })
    })
  }
}
