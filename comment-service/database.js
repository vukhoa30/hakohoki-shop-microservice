var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

module.exports = {
  Comment: (comment) => {
    return new Promise((resolve, reject) => {
      var newComment = new models.Comment(comment)
      newComment
      .save((err, rslt) => {
        if (err) { reject(err) }
        else ( resolve(rslt._id) )
      })
    })
  },
  GetComments: (productId) => {
    return new Promise((resolve, reject) => {
      models.Comment
      .find({ productId })
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt.map(r => {
          return {
            id: r._id,
            content: r.content,
            accountId: r.accountId,
            productId: r.productId,
            parentId: r.parentId,
            createdAt: r.createdAt,
            reviewScore: r.reviewScore
          }
        }))
      })
    })
  }
}
