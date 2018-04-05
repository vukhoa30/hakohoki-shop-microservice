var db = require('./database')
//var helper = require('../helper')
var msgBroker = require('./connection/message-broker')

//chỉ chạy 1 promise
var typicalResponse = (res, func) => {
  func.then(rslt => res.json(rslt))
  .catch(err => catchError(res, err));
}

var catchError = (res, err) => {
  console.log(err)
  res.status(500);
  res.json({ msg: 'INTERNAL SERVER ERROR', err: err });
}

var catchUnauthorized = (res) => {
  res.status(401);
  res.json({ msg: 'Unauthorized user.' })
}

module.exports = {
  createBill: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'receptionist') { return catchUnauthorized(res) }

      var rslt = await db.CreateBill({
        seller: authentication.accountId,
        buyer: req.body.buyer,
        specificProducts: req.body.specificProducts
      });
      await msgBroker.requestUpdateSpecificsStatus(
        req.body.specificProducts.map(p => p.id))

      var products = await msgBroker.requestGetSpecificProducts(
        req.body.specificProducts.map(p => p.id))
      if (req.body.buyer.accountId) {
        await msgBroker.requestNotificationRequest(products.map(p => {
          return {
            type: 'productBought',
            accountId: req.body.buyer.accountId,
            productId: p.productId,
            productName: p.productName
          }
        }))
      }

      var watchlistItems = await msgBroker.requestGetWatchlistUsers(products
        .filter(p => p.productQuantity >= 1 && p.productQuantity <= 2)
        .map(p => p.productId))
      if (req.body.buyer.accountId) {
        watchlistItems = watchlistItems.filter(i => i.accountId.toString != req.body.buyer.accountId.toString())
      }

      console.log(watchlistItems.map(i => {
        var finder = products.find(
          e => e.productId.toString() == i.productId.toString())
        return {
          type: 'almostOutOfStock',
          accountId: i.accountId,
          productId: i.productId,
          productName: finder.productName,
          amount: finder.productQuantity
        }
      }))

      await msgBroker.requestNotificationRequest(watchlistItems.map(i => {
        var finder = products.find(
          e => e.productId.toString() == i.productId.toString())
        return {
          type: 'almostOutOfStock',
          accountId: i.accountId,
          productId: i.productId,
          productName: finder.productName,
          amount: finder.amount
        }
      }))
      res.json({ ok: true })
    } catch(e) { catchError(res, e) }
  },
  getBillsByBuyer: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication) { return catchUnauthorized(res) }

      var bills = await db.GetBillsByTime(
        req.query.begin, req.query.end)
      var employeeIds = bills.map(b => b.seller)
      var employees = await msgBroker.requestGetEmployees(employeeIds)
      var bills = await db.GetBillsByBuyer(req.query)
      var employeeIds = bills.map(b => b.seller)
      var employees = await msgBroker.requestGetEmployees(employeeIds)
      bills.forEach(b => { 
        var employee = employees.find(e => e.accountId === b.seller)
        b.seller = employee
      })
      res.json(bills)
    } catch(e) { catchError(res, e) }
  },
  getBillsByTime: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication) { return catchUnauthorized(res) }

      var bills = await db.GetBillsByTime(
        req.query.begin, req.query.end)
      var employeeIds = bills.map(b => b.seller)
      var employees = await msgBroker.requestGetEmployees(employeeIds)
      bills.forEach(b => { 
        var employee = employees.find(e => e.accountId === b.seller)
        b.seller = employee
      })
      res.json(bills)
    } catch(e) { catchError(res, e) }
  }
}