module.exports = (mongoose) => { 
  return {
    Account: mongoose.model('Account', {
      email: { type: String, index: { unique: true }},
      password: String,
      status: String,
      fullName: String
    })
  }
}