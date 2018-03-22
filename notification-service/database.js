var mongoose = require('mongoose');

var dbAddress = require('./config.js').dbAddress;
mongoose.connect(dbAddress);

var models =  require('./models')(mongoose);

var handleCallback = (err, rslt) => {
  if (err) { return false; }
  return rslt;
}

module.exports = {
  AddNotification: (email, content, navigateLink) => {
    navigateLink = navigateLink || '';
    return new Promise((resolve, reject) => {
      models.Notification
      .find({ email })
      .exec((err, rslt) => {
        var newItem = { 
          createdAt: new Date(),
          content,
          navigateLink
        }
        if (rslt.length === 0) {
          var newNotification = models.Notification({
            email,
            list: [ newItem ]
          })
          models.Notification
          .save(newNotification, (err, rslt) => {
            if (err) { reject(err) }
            else { resolve(rslt) }
          })
        } else {
          models.Notification.update({ email }, {
            $push: { list: newItem }
          }, (err, rslt) => {
            if (err) reject(err);
            else resolve(rslt);
          })
        }
      })
    })
  },
  GetNotifications: (email) => {
    return new Promise((resolve, reject) => {
      models.Notification
      .find({ email })
      .exec((err, rslt) => {
        if (err) { reject(err) }
        else { resolve(rslt[0].list) }
      })
    })
  }
}
