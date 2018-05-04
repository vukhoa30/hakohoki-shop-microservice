var express = require('express');
var morgan = require('morgan');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 7006;
var path = require('path')
var bodyParser = require('body-parser')
var core = require('../core.js')
var responseAmqp = require('./message-broker')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(morgan('combined'));

//REST API ------------------------------------------------------------------
app.get('/', core.authenticate, core.getNotification)

app.get('/subscription-comment-posted', core.authenticate, core.getSubscriptionsCommentPosted)
app.post('/subscription-comment-posted', core.authenticate, core.subscribeCommentPosted)
app.delete('/subscription-comment-posted', core.authenticate, core.unsubscribeCommentPosted)

app.put('/read', core.authenticate, core.readNotifications)

//response amqp
responseAmqp.consumeNotificationRequest()

//Running server-------------------------------------------------------------
server.listen(port, function () {
    console.log('Notification service is listening at port %d', port);
});
//---------------------------------------------------------------------------