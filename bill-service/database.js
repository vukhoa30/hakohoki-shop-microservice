var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var parseRslt = (rslts) => { 
  return rslts.map(rslt => { 
    return {
      _id: rslt._id,
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
  GetBills: (queryInput) => {
    var limit = queryInput ? 0 : 100
    var query = {}
    if (queryInput.billId) { query._id = queryInput.billId }
    else {
      if (queryInput.begin || queryInput.end) { query.createdAt = {} }
      Object.keys(queryInput).map(k => {
        if (k === 'begin') { query.createdAt.$gt = new Date(queryInput.begin) }
        else if (k === 'end') { query.createdAt.$lt = new Date(queryInput.end) }
        else if (k === 'status') { query.status = queryInput.status }
        else { query[`buyer.${k}`] = queryInput[`${k}`] }
      })
    }
    return new Promise((resolve, reject) => {
      models.Bill
      .find(query)
      .limit(limit)
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(parseRslt(rslt)) }
      })
    })
  },
  GetBillsByTime: (begin, end, status) => {
    var query = { createdAt: {} }
    if (begin) { query.createdAt.$gt = new Date(begin) }
    if (end) { query.createdAt.$lt = new Date(end) }
    if (status) { query.status = status }
    return new Promise((resolve, reject) => {
      models.Bill
      .find(query)
      .sort({ createdAt: -1 })
      .exec((err, rslt) => {
        console.log(rslt)
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
