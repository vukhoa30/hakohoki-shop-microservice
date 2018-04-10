module.exports = (mongoose) => { 
  return {
    Notification: mongoose.model('Notification', {
      accountId: String,
      createdAt: { type: Date, default: new Date() },
      read: { type: Boolean, default: false },
      type: String,
      productId: mongoose.Schema.ObjectId,
      promotionId: Number,
      amount: Number,
      commentId: mongoose.Schema.ObjectId
    })
  }
}