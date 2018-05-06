module.exports = (mongoose) => { 
  return {
    Bill: mongoose.model('Bill', {
      createdAt: { type: Date, default: new Date() },
      paymentMethod: { type: String, default: 'cash' },
      seller: Number,
      buyer: Object,
      specificProducts: Array, //price, id, giftSpecificIds
      status: { type: String, default: 'completed' },
      completedAt: Date
    })
  }
}