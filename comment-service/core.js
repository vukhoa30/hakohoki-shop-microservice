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
  comment: async (req, res) => {
    var token;
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      token = req.headers.authorization.split(' ')[1]
    } else { return catchUnauthorized(res) }
    try {
      var authentication = await msgBroker.requestAuthenticateCustomer(token)
      if (!authentication) {
        authentication = await msgBroker.requestAuthenticateEmployee(token)
      }
      if (!authentication) { return catchUnauthorized(res) }

      var commentId = await db.Comment({
        content: req.body.content,
        accountId: authentication.accountId,
        productId: req.body.productId,
        parentId: req.body.parentId,
        reviewScore: req.body.reviewScore,
        createdAt: new Date()
      })

      var products = await msgBroker.requestGetProducts([req.body.productId])
      var productName = products[0].name
      if (req.body.parentId) {
        var comments = await db.GetCommentById(req.body.parentId)
        var accountId = comments[0].accountId
        msgBroker.produceNotificationRequest([{
          type: 'commentReplied',
          accountId,
          productId: req.body.productId,
          productName,
          commentId: req.body.parentId
        }])
      }
      else {
        var receiptionistIds = await msgBroker.requestGetAllEmployees({nothing:true})
        console.log(receiptionistIds)
        msgBroker.produceNotificationRequest(
          receiptionistIds.map(id => {
            return {
              type: 'commentPosted',
              accountId: id,
              productId: req.body.productId,
              productName,
              commentId
            }
          })
        )
      }
      res.json({id: commentId})
    } catch (e) { catchError(res, e) }
  },
  getComments: (req, res) => {
    db.GetComments(req.params.productId)
    .then(async rslt => {
      var accountIds = rslt.map(r => r.accountId)
      try {
        var customers = await msgBroker.requestCustomers(accountIds
          .filter(id => id.length == 24))
        var employees = await msgBroker.requestEmployees(accountIds
          .filter(e => parseInt(e))
          .map(e => parseInt(e)))
        var accounts = customers.concat(employees)
      } catch (e) {return catchError(res, e)}
      res.json(rslt
        .map(r => {
          var accountInfo = accounts.find(e => 
            e.accountId.toString() == r.accountId.toString())
          var account = {};
          if (accountInfo) {
            account = {
              userId: accountInfo.accountId,
              userName: accountInfo.fullName,
              userRole: accountInfo.role
            }
          }
          return {
            ...r,
            ...account
          }
        })
      )
    })
    .catch(e => catchError(res, e))
  }
}