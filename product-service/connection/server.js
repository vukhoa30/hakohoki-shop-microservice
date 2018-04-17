var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7002;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

var responseAmqp = require('./message-broker.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.get('/latest', core.getLatestProducts)
app.get('/info/:id', core.getProduct)
app.get('/search', core.getProductsByName) //tìm theo specifications luôn
//app.post('/search/:query', core.getProductsBySpecifications)
app.get('/info/:id/in-stock', core.getSpecificProductsInStock)
app.get('/info/specific/:id', core.getProductBySpecificId)
//app.get('/info/specific/:id/guarantee', core.getGuarantee)
app.get('/categories', core.getAllCategories)
//app.get('/specifications', core.getAllSpecifications)

app.post('/', core.addNewProduct)
app.post('/specific', core.addNewSpecificProducts)
//app.post('/categories', core.addCategory)
//app.post('/specifications', core.addSpecification)
//app.post('/specifications/value', core.addSpecificationValue)

//app.put('/sell', core.sell)
app.put('/product', core.alterProduct)

//app.delete('/specifications/value', core.removeSpecificationValue)
//app.delete('/categories', core.removeCategory)
//app.delete('/specifications', core.removeSpecification)

//Response amqp
responseAmqp.responseGetProducts()
responseAmqp.responseGetSpecificProducts()
responseAmqp.responseUpdateSpecificsStatus()
responseAmqp.responseGetPendingProducts()
responseAmqp.responseGetSpecificInfos()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Product service is listening at port %d', port);
});
//---------------------------------------------------------------------------