module.exports = (mongoose) => { 
  return {
    Comment: mongoose.model('Comment', {
      content: String,
      accountId: String,
      productId: mongoose.Schema.ObjectId,
      parentId: mongoose.Schema.ObjectId,
      createdAt: { type: Date, default: new Date() },
      reviewScore: Number
    })
  }
}