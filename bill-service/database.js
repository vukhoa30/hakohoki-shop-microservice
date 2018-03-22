var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

module.exports = {
  CreateBill: (bill) => {
    return new Promise((resolve, reject) => {
      var newBill = new models.Bill(bill)
      newBill
      .save((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt) )
      })
    })
  },
  GetBuyTime: (productId) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .findOne({ specificProducts: {$elemMatch:{productId: id}} })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt) )
      })
    })
  },
  GetBillById: (billId) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .findOne({ _id: billId })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt) )
      })
    })
  },
  GetBillsByCustomerPhoneNumber: (phoneNo) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .find({ buyer: { phoneNumber: phoneNo } })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt) )
      })
    })
  },
  GetBillsByCustomerEmail: (email) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .find({ buyer: { email } })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt) )
      })
    })
  },
}
