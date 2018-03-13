var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
var path = require('path')
var bodyParser = require('body-parser')
var kafka = require('../kafka')
var helper = require('../helper')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, '../public')))
app.use("/lib", express.static(path.join(__dirname, '../node_modules')))


// API ---------------------------------------------
app.post('/message', async (req, res) => {

    const topic = req.body.topic, message = JSON.stringify(req.body.message)
    try {
        await kafka.sendMessage(topic, message)
        res.json({ msg: 'OK' })
    } catch (error) {
        res.status(500).json({ msg: 'FAILED' })
    }

})

app.get('/topics', async (req, res) => {

    try {
        const topics = await kafka.getTopics()
        res.json({ list: topics })
    } catch (error) {
        res.status(500).json({ msg: 'INTERNAL SERVER ERROR' })
    }

})


app.post('/topic', async (req, res) => {

    const topic = req.body.topic
    try {
        await kafka.createTopic(topic)
        res.json({ msg: 'OK' })
    } catch (error) {
        res.status(500).json({ msg: 'INTERNAL SERVER ERROR' })
    }

})

app.delete('/topic', (req, res) => {

    res.json({ msg: 'Not available' })

})

//-----------------------------------------------------------------------------------------

//Socket IO ------------------------------------------------------------------

io.on('connection', function (socket) {

    let consumer = null
    console.log("New connection found")

    socket.on("SUBSCRIBE_TOPIC", data => {

        const topic = data.topic

        if (consumer != null) {

            consumer.addTopics(new Array(data.topic))

        } else {

            consumer = kafka.getConsumer(new Array(topic))

            consumer.on('message', function (message) {
                socket.emit("NEW_MESSAGE", { topic: message.topic, message: helper.formatValue(message.value) })
            })

        }

    })

    socket.on("UNSUBSCRIBE_TOPIC", data => {

        if (consumer != null) {

            consumer.removeTopics(new Array(data.topic))

        }

    })

    socket.on("SUBSCRIBE_MULTIPLE_TOPICS", data => {

        if (consumer != null) {

            consumer.addTopics(data.topics)

        } else {

            consumer = kafka.getConsumer(data.topics)

            consumer.on('message', function (message) {
                socket.emit("NEW_MESSAGE", { topic: message.topic, message: helper.formatValue(message.value) })
            })

        }


    })

    socket.on("NEW_MESSAGE", async data => {

        const topic = data.topic, message = JSON.stringify(data.message)
        try {
            await kafka.sendMessage(topic, message)
        } catch (error) {

        }

    })

    socket.on('disconnect', function () {

        console.log("Client disconnected")

    })


})

//--------------------------------------------------------------------------------------------

server.listen(port, function () {
    console.log('Message broker service is listening at port %d', port);
});