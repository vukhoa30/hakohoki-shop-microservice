var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7002;
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
app.get('/latest', core.getLatestProducts)
app.get('/info/:id', core.getProduct)
app.get('/search/:query', core.getProducts)
app.get('/info/:id/in-stock', core.getNumberOfProductsInStock)
app.get('/categories', core.getAllCategories)
app.get('/specifications', core.getAllSpecifications)

app.post('/product', core.addNewProduct)
app.post('/specific', core.addNewSpecificProducts)
app.post('/categories', core.addCategory)
app.post('/specifications', core.addSpecification)
app.post('/specifications/value', core.addSpecificationValue)

app.put('/sell', core.sell)
app.put('/product', core.alterProduct)


/*app.post('/', async function (req, res) { //Create account

    const email = req.body.email, password = req.body.password
    console.log(req.body.email);
    try {
        return (await core.createNewAccount(email, password)) ? res.json({ msg: 'OK' }) : res.status(409).json({ msg: 'ACCOUNT EXISTED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "INTERNAL SERVER ERROR" })
    }
    
})*/

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Product service is listening at port %d', port);
});
//---------------------------------------------------------------------------