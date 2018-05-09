var db = require('./database')
//var helper = require('../helper')
var msgBroker = require('./connection/message-broker')

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

      var createTime = new Date()
      var rslt = await db.CreateBill({
        seller: authentication.accountId,
        buyer: req.body.buyer,
        specificProducts: req.body.specificProducts,
        status: 'completed',
        createdAt: createTime,
        completedAt: createTime
      });
      var specificIds = []
      req.body.specificProducts.map(p => {
        specificIds.push(p.id)
        if (p.giftSpecificIds) {
          specificIds = specificIds.concat(p.giftSpecificIds)
        }
      })
      await msgBroker.requestUpdateSpecificsStatus(specificIds)

      var products = await msgBroker.requestGetSpecificProducts(
        req.body.specificProducts.map(p => p.id))
      if (req.body.buyer.accountId) {
        msgBroker.produceNotificationRequest([{
          type: 'productBought',
          accountId: req.body.buyer.accountId,
          billId: rslt._id
        }])
      }
      if (req.body.buyer.accountId || req.body.buyer.email) {
        var email
        if (req.body.buyer.accountId) {
          var customer = await msgBroker.requestCustomers([req.body.buyer.accountId])
          var email = customer[0].email
        } else {
          email = req.body.buyer.email
        }
        msgBroker.produceEmailRequest([{
          type: 'productBought',
          email,
          productsName: products.map(p => p.productName)
        }])
      }

      var watchlistItems = await msgBroker.requestGetWatchlistUsers(products
        .filter(p => p.productQuantity >= 1 && p.productQuantity <= 2)
        .map(p => p.productId))
      if (req.body.buyer.accountId) {
        watchlistItems = watchlistItems.filter(i => i.accountId.toString() != req.body.buyer.accountId.toString())
      }
      var customers = await msgBroker.requestCustomers(watchlistItems.map(i =>
        i.accountId))
      watchlistItems.map(i => {
        var finder = customers.find(c => 
          c.accountId.toString() == i.accountId.toString())
        i.email = finder.email

        finder = products.find(
          e => e.productId.toString() == i.productId.toString())
        i.productName = finder.productName
        i.amount = finder.productQuantity
      })

      if (watchlistItems.length > 0) {
        msgBroker.produceNotificationRequest(watchlistItems.map(i => {
          return {
            type: 'almostOutOfStock',
            accountId: i.accountId,
            productId: i.productId,
            productName: i.productName,
            amount: i.amount
          }
        })),
        msgBroker.produceEmailRequest(watchlistItems.map(i => {
          return {
            type: 'almostOutOfStock',
            email: i.email,
            productName: i.productName,
            amount: i.amount
          }
        }))
      }
      res.json({ ok: true })
    } catch(e) { catchError(res, e) }
  },
  createPendingBill: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateCustomer(token)
      //if (!authentication) { return catchUnauthorized(res) }

      var specificProducts = await msgBroker.requestGetPendingProducts(req.body)
      if (!specificProducts) { return catchError(res, 'insufficient amount') }
      
      var rslt = await db.CreateBill({
        status: "pending",
        buyer: authentication ? {
          accountId: authentication.accountId
        } : req.body.buyer,
        specificProducts: specificProducts.map(s => { 
          return { id: s.specificId, price: s.price, giftSpecificIds: s.specificGiftIds }
        }),
        createdAt: new Date(),
      })
      
      if (await !msgBroker.requestClearCart(authentication.accountId)) {
        res.json({ ok: false, msg: 'clearing cart failed' })
      } else {
        res.json({ ok: true, msg: 'cart cleared, order added' })
      }

      /*var watchlistItems = await msgBroker.requestGetWatchlistUsers(products
        .filter(p => p.productQuantity >= 1 && p.productQuantity <= 2)
        .map(p => p.productId))
      if (req.body.buyer.accountId) {
        watchlistItems = watchlistItems.filter(i => i.accountId.toString() != req.body.buyer.accountId.toString())
      }
      var customers = await msgBroker.requestCustomers(watchlistItems.map(i =>
        i.accountId))
      watchlistItems.map(i => {
        var finder = customers.find(c => 
          c.accountId.toString() == i.accountId.toString())
        i.email = finder.email

        finder = products.find(
          e => e.productId.toString() == i.productId.toString())
        i.productName = finder.productName
        i.amount = finder.productQuantity
      })

      if (watchlistItems.length > 0) {
        msgBroker.produceNotificationRequest(watchlistItems.map(i => {
          return {
            type: 'almostOutOfStock',
            accountId: i.accountId,
            productId: i.productId,
            productName: i.productName,
            amount: i.amount
          }
        })),
        msgBroker.produceEmailRequest(watchlistItems.map(i => {
          return {
            type: 'almostOutOfStock',
            email: i.email,
            productName: i.productName,
            amount: i.amount
          }
        }))
      }*/
    } catch(e) { catchError(res, e) }
  },
  completeBill: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'receptionist') { return catchUnauthorized(res) }

      var bill = await db.GetBillById(req.body.billId)
      if (!bill) { return catchError(res, 'bill not found') }
      console.log(bill)
      var specificIds = []
      bill.specificProducts.forEach(s => {
        specificIds.push(s.id)
        if (s.giftSpecificIds) { specificIds = specificIds.concat(s.giftSpecificIds) }
      })
      console.log(specificIds)
      await msgBroker.requestUpdateSpecificsStatus(specificIds)
      
      var rslt = await db.CompleteBill(req.body.billId, authentication.accountId)
      res.json({ ok: true })

      var products = await msgBroker.requestGetSpecificProducts(
        bill.specificProducts.map(p => p.id))
      msgBroker.produceNotificationRequest(products.map(p => {
        return {
          type: 'productBought',
          accountId: bill.buyer.accountId,
          productId: p.productId,
          productName: p.productName
        }
      }))
      var customer = await msgBroker.requestCustomers([bill.buyer.accountId])
      var email = customer[0].email
      msgBroker.produceEmailRequest(products.map(p => {
        return {
          type: 'productBought',
          email,
          productName: p.productName
        }
      }))
    } catch(e) { catchError(res, e) }
  },
  getBills: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication) { return catchUnauthorized(res) }

      var bills
      if (req.params.billId) {
        bills = await db.GetBills(req.params)
      } else {
        bills = await db.GetBills(req.query)
      }
      if (bills.length < 1) {
        throw 'data not found'
      }

      var customerIds = []
      var employeeIds = bills.map(b => {
        if (b.buyer.accountId) { 
          customerIds.push(b.buyer.accountId)
        }
        return b.seller
      })
      var employees = await msgBroker.requestGetEmployees(employeeIds)

      var specificIds = [];
      bills.forEach(b => {
        b.specificProducts.map(p => {
          specificIds.push(p.id)
          if (p.giftSpecificIds) {
            specificIds = specificIds.concat(p.giftSpecificIds)
          }
        })
      })
      var specificInfos = await msgBroker.requestGetSpecificInfos(specificIds)

      bills.forEach(b => { 
        var employee = employees.find(e => e.accountId === b.seller)
        b.seller = employee
        b.specificProducts.map(p => {
          var finder = specificInfos.find(s => 
            s.specificId.toString() == p.id.toString())
          if (finder) {
            p.productName = finder.productName
            p.mainPicture = finder.mainPicture
          }
          if (p.giftSpecificIds) {
            p.giftSpecificIds.forEach(g => {
              finder = specificInfos.find(s => 
                s.specificId.toString() == g.toString())
              if (finder) {
                if (!p.specificGifts) { p.specificGifts = [] }
                p.specificGifts.push({
                  id: g,
                  productName: finder.productName,
                  mainPicture: finder.mainPicture
                })
              }
            })
            p.giftSpecificIds = undefined
          }
        })
      })

      if (req.params.billId) {
        bills = bills[0]
      }
      res.json(bills)
    } catch(e) { catchError(res, e) }
  },
  getStatistics: async (req, res) => {
    try {
      var token;
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        token = req.headers.authorization.split(' ')[1]
      } else { return catchUnauthorized(res) }
      var authentication = await msgBroker.requestAuthenticateEmployee(token)
      if (!authentication || authentication.role !== 'manager') { return catchUnauthorized(res) }

      var bills = await db.GetBills({...req.query, status: 'completed'})
      var income = 0
      var allProducts = await msgBroker.requestGetAllProducts()
      var allCategoryNames = await msgBroker.requestGetAllCategories()
      var allCategories = []
      var specificIds = []
      bills.forEach(b => {
        specificIds = specificIds.concat(b.specificProducts.map(s => {
          income += s.price
          return s.id
        }))
      })
      var specificProducts = await msgBroker.requestGetSpecificInfos(specificIds)

      allCategoryNames.forEach(name => {
        allCategories.push({
          name,
          soldCount: specificProducts.filter(s => 
            s.category === name).length
        })
      })
      allProducts.forEach(product => {
        product.soldCount = specificProducts.filter(s => 
          s.productId.toString() == product._id.toString()).length
      })

      res.json({
        billCount: bills.length,
        income,
        categories: allCategories,
        products: allProducts
      })
    } catch(e) { catchError(res, e) }
  }
}