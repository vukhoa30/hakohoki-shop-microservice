module.exports = (mongoose) => { 
  return {
    Comment: mongoose.model('Comment', {
      content: String,
      userEmail: String,
      productId: mongoose.Schema.ObjectId,
      parentComment: mongoose.Schema.ObjectId,
      createdAt: { type: Date, default: new Date() },
      reviewScore: Number
    })
  }
}