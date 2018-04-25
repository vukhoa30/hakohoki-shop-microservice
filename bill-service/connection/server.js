var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7008;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.get('/', core.getBills)
app.get('/:billId', core.getBills)
app.get('/statistics/info', core.getStatistics)
app.post('/', core.createBill)
app.post('/order', core.createPendingBill)
app.put('/order', core.completeBill)
//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Bill service is listening at port %d', port);
});
//---------------------------------------------------------------------------