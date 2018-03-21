var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7004;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

/*var a = new Promise((res, rej) => {
  if (true) res(5);
  else rej(10);
})
var b = new Promise((res, rej) => {
  if (false) res(3);
  else rej(7);
})

a
.then(rslt => b)
.then(rslt => console.log(rslt))
.catch(e => console.log(e));*/

//REST API ------------------------------------------------------------------
app.get('/', core.getCurrentPromotion)

app.post('/price', core.getNewPrices)
app.post('/', core.createPromotion)

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Promotion service is listening at port %d', port);
});
//---------------------------------------------------------------------------