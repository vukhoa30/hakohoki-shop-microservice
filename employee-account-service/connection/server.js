var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7003;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.post('/authenticate', core.authenticate)
app.post('/', core.createAccount)
app.post('/login', core.logIn)

app.put('/password', core.changePassword)
app.put('/reactivate', core.reactiveAccount)
app.put('/deactivate', core.deactiveAccount)

app.get('/test', (req, res) => { console.log(req.headers.abc); console.log(req.account); res.json(req.account) })

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Employee-account service is listening at port %d', port);
});
//---------------------------------------------------------------------------