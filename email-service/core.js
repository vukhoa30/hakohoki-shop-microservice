var config = require('./config.js')
var transporter = config.transporter

let mailOptions = (to, subject, html) => {
  return {
    from: config.transporterName, // sender address
    to, // list of receivers
    subject, // Subject line
    html // html body
  }
};

module.exports = {

  sendMailWhenProductsFilledInStock = (emails, productName) => {
    transporter.sendMail(mailOptions(
      emails,
      `Your watching product is now in stock! (${productName})`,
      `<p>The product <b>${productName}</b> that you are watching is now
      in stock! Check it out!</p>`
    ))
  },
  sendMailWhenProductAlmostOutOfStock = (emails, productName, amountLeft) => {
    transporter.sendMail(mailOptions(
      emails,
      `Your watching product is almost out of stock! (${productName}`,
      `<p>The product <b>${productName}</b> that you are watching is almost
      out of stock (${amountLeft} left)! Get it now!</p>`
    ))
  },
  sendMailWhenProductIsBought = (email, productName) => {
    transporter.sendMail(mailOptions(
      email,
      `Thank you for shopping at our store!`,
      `<p>You have just bought ${productName} at our store.</p>
      <p>Please review the product on the app or reply to this email to 
      let us know if you have any problem with the perchase.</p>
      <p>Sincerely.</p>`
    ))
  },
  sendMailWhenPromotionCreated = (email, promotionName) => {
    transporter.sendMail(mailOptions(
      email,
      `New promotion: ${promotionName}!`,
      `<h1>${promotionName}</h1>
      <p>We are offering a promotion with many products on great discount.</p>
      <p>Please check out at our store.</p>`
    ))
  }
  
}