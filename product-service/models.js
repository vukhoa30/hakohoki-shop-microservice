var uniqueValidator = require('mongoose-unique-validator')

module.exports = (mongoose) => { 
  var productSchema = new mongoose.Schema({
    category: String,
    mainPicture: String,
    additionPicture: [ String ],
    addedAt: { type: Date, default: Date.now() },
    name: { type: String, index: { unique: true } },
    description: String,
    specifications: Object,
    price: Number,
    guarantee: Number
  });
  productSchema.index({'name': 'text'});
  productSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
  
  return {
    Category: mongoose.model('Category', {
      name: String
    }),

    Specification: mongoose.model('Specification', {
      name: String,
      key: { type: String, index: { unique: true } },
      categories: [ String ],
      values: Array
    }),

    Product: mongoose.model('Product', productSchema),

    SpecificProduct: mongoose.model('SpecificProduct', {
      productId: mongoose.Schema.ObjectId,
      addedAt: { type: Date, default: Date.now() },
      status: String
    }, 'products.specific')
}}