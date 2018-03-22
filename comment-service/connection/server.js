var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7007;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

/*var handleRslt = async (req, res, func) => {
  try {
    var products = await core.getLatestProducts();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "INTERNAL SERVER ERROR" })
  }
}*/

//REST API ------------------------------------------------------------------
app.get('/:productid', core.getComments)

app.post('/:productid', core.comment)

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Comment service is listening at port %d', port);
});
//---------------------------------------------------------------------------