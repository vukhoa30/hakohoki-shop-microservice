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
        else ( resolve(rslt) )
      })
    })
  },
  GetComments: (productId) => {
    return new Promise((resolve, reject) => {
      models.Comment
      .find({ productId })
      .exec((err, rslt) => {
        if (err) reject(err);
        else resolve(rslt);
      })
    })
  }
}
