var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7000;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));


//REST API ------------------------------------------------------------------
app.post('/', async function (req, res) { //Create account

    const email = req.body.email, password = req.body.password
    try {
        return (await core.createNewAccount(email, password)) ? res.json({ msg: 'OK' }) : res.status(409).json({ msg: 'ACCOUNT EXISTED' })
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
        res.status(500).json({ msg: "INTERNAL SERVER ERROR" })
    }

})

app.post('/authorization', async function (req, res) {

    const email = req.body.email, authCode = req.body.authCode
    try {
        const result = await core.authorize(email, authCode)
        return result ? res.json({ msg: 'OK' }) : res.status(401).json({ msg: 'AUTHORIZATION CODE NOT MATCHED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "INTERNAL SERVER ERROR" })
    }

})
//---------------------------------------------------------------------------


//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Account service is listening at port %d', port);
});
//---------------------------------------------------------------------------