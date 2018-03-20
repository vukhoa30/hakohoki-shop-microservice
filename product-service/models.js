module.exports = (mongoose) => { 
  var productSchema = new mongoose.Schema({
    category: String,
    mainPicture: String,
    additionPicture: [ String ],
    addedAt: { type: Date, default: Date.now() },
    name: String,
    description: String,
    specifications: Object,
    price: Number,
    guarantee: Number
  });
  productSchema.index({'name': 'text'});
  
  return {
    Category: mongoose.model('Category', {
      name: String
    }),

    Specification: mongoose.model('Specification', {
      name: String,
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