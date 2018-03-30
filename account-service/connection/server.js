var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7000;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core')

var amqpResponse = require('./message-broker')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(morgan('combined'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var checkLoggedIn = (req, res, next) => {
  if (req.account && req.account.role == 'customer') {
    next();
  } else {
    res.status(401);
    res.json({ msg: 'Unauthorized user!' });
  }
}

//REST API ------------------------------------------------------------------
app.get('/', function (req, res) {
    res.json({ msg: 'Welcome to account service' })
})

app.post('/', async function (req, res) { //Create account

    const email = req.body.email, password = req.body.password,
      fullName = req.body.fullName
    console.log(req.body.email);
    try {
        return (await core.createNewAccount(email, password, fullName)) ? res.json({ ok: true }) : res.status(409).json({ msg: 'ACCOUNT EXISTED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "INTERNAL SERVER ERROR" })
    }

})

app.post('/authentication', async function (req, res) { //Authenticate account

    const email = req.body.email, password = req.body.password
    try {
        const result = await core.authenticate(email, password)
        if (result.code === 200)
            res.json({ token: result.token })
        else
            res.status(result.code).json({ msg: result.msg })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err: error })
    }

})

app.post('/activation', async function (req, res) {

    const email = req.body.email, activationCode = req.body.activationCode
    try {
        const result = await core.activate(email, activationCode)
        return result ? res.json({ ok: true }) : res.status(401).json({ msg: 'ACTIVATION CODE NOT MATCHED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err: error })
    }

})


//---------------------------------------------------------------------------
amqpResponse.responseAuthenticateCustomer()
amqpResponse.responseGetCustomers()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Account service is listening at port %d', port);
});
//---------------------------------------------------------------------------