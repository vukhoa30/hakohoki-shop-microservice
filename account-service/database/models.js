module.exports = (mongoose) => { 
  account = new mongoose.Schema({
    email: String,
    password: String,
    status: String,
    fullName: String,
    phoneNumber: String
  })
  account.index({ email: 1, phoneNumber: 1 }, { unique: true })
  return {
    Account: mongoose.model('Account', account)
  }
}