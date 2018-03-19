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

  sendMailWhenProductsFilledInStock = (email, product) => {
    transporter.sendMail(mailOptions(
      email,
      `Your product is now in stock! (${product.name})`,
      `<p>The product <b>${product.name}</b> that you are watching is now
      in stock! Check it out!</p>`
    ))
  },

  sendMailWhenProductIsBought = (email, product) => {
    transporter.sendMail(mailOptions(
      email,
      `Thank you for shopping at our store!`,
      `<p>You have just bought ${product.name} at our store.</p>
      <p>Please review the product on the app or reply to this email to 
      let us know if you have any problem with the perchase.</p>
      <p>Sincerely.</p>`
    ))
  }
}