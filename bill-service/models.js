module.exports = (mongoose) => { 
  return {
    Bill: mongoose.model('Bill', {
      createdAt: { type: Date, default: new Date() },
      paymentMethod: { type: String, default: 'cash' },
      seller: String,
      buyer: Object,
      specificProducts: Array, //price, id
      vouchers: Array
    })
  }
}