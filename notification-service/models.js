module.exports = (mongoose) => { 
  return {
    Notification: mongoose.model('Notification', {
      accountId: String,
      createdAt: { type: Date, default: new Date() },
      type: String,
      productId: mongoose.Schema.ObjectId,
      promotionId: Number,
      amount: Number
    })
  }
}