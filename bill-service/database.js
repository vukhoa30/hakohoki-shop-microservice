var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var parseRslt = (rslts) => { 
  return rslts.map(rslt => { 
    return {
      createdAt: rslt.createdAt,
      paymentMethod: rslt.paymentMethod,
      seller: rslt.seller,
      buyer: rslt.buyer,
      specificProducts: rslt.specificProducts,
      status: rslt.status,
      completedAt: rslt.completedAt
    }
  }
)}

module.exports = {
  CreateBill: (bill) => {
    return new Promise((resolve, reject) => {
      var newBill = new models.Bill(bill)
      newBill
      .save((err, rslt) => {
        if (err) { reject(err) }
        else { console.log(rslt); resolve(rslt) }
      })
    })
  },
  CompleteBill: (billId, seller) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .update({ _id: billId }, {
        $set: {
          seller,
          completedAt: new Date(),
          status: 'completed'
        }
      }, (err, rslt) => {
        if (err) { reject(err) }
        else { resolve(rslt) }
      })
    })
  },
  GetBillsByBuyer: (buyer) => { // [ conditions ]
    var query = {}
    Object.keys(buyer).map(k => {
      query[`buyer.${k}`] = buyer[`${k}`]
    })
    return new Promise((resolve, reject) => {
      models.Bill
      .find(query)
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(parseRslt(rslt)) }
      })
    })
  },
  GetBillsByTime: (begin, end) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .find({
        createdAt: {$lt: end, $gt: begin}
      })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(parseRslt(rslt)) }
      })
    })
  },
  GetBillById: (id) => {
    return new Promise((resolve, reject) => {
      models.Bill
      .find({ _id: id })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(parseRslt(rslt)[0]) }
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
  }
}
