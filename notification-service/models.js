module.exports = (mongoose) => { 
  return {
    Notification: mongoose.model('Notification', {
      email: { type: String, index: { unique: true } },
      list: Object
    })
  }
}