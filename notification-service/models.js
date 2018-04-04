module.exports = (mongoose) => { 
  return {
    Notification: mongoose.model('Notification', {
      accountId: String,
      createdAt: { type: Date, default: new Date() },
      type: String,
      props: Object
    })
  }
}