require('log-timestamp')(function () { return '[' + new Date().toLocaleString() + ']' + ' %s' })

var kafka = require('kafka-node')
var client = new kafka.Client
var _ = require('lodash')

process.on('exit', function () {

    client.close()

})

//Producer initialization -------------------------------------

var Producer = kafka.Producer,
    producer = new Producer(client)

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
})

function sendMessage(topic, message) {

    const payloads = [
        { topic: topic, messages: message }
    ];

    return new Promise((resolve, reject) => {

        producer.send(payloads, function (err, data) {

            if (err) {
                console.log("Error found in message for topic " + topic)
                console.log(err)
                resolve(false)
            } else {
                console.log("New message for topic " + topic + " was sent")
                resolve(true)
            }

        })

    })


}

//-----------------------------------------------------------------



//Consumer initialization------------------------------------------------

var Consumer = kafka.Consumer

//----------------------------------------------------------------------------------



//Running server--------------------------------------------------------------------

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
var path = require('path')
var bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')))
app.use("/lib", express.static(path.join(__dirname, 'node_modules')))


// API ---------------------------------------------
app.post('/message', async (req, res) => {

    const topic = req.body.topic, message = JSON.stringify(req.body.message)
    const isSuccessful = await sendMessage(topic, message)
    if (isSuccessful)
        res.json({ msg: 'OK' })
    else
        res.status(500).json({ msg: 'FAILED' })

})

app.get('/topics', (req, res) => {

    client.loadMetadataForTopics([], function (error, results) {
        if (error) {
            console.error("GET /topics: " + error);
            return res.status(500).json({ msg: error })
        }
        res.json({ list: Object.keys(_.get(results, '1.metadata')) })
    });

})


app.post('/topic', (req, res) => {

    const topic = req.body.topic
    producer.createTopics(new Array(topic), true, function (err, data) {
        if (err) {
            console.log("POST /topic: " + err)
            res.status(500).json({ msg: err })
        } else {
            console.log(`Topic ${topic} has been created`)
            res.json({ msg: 'OK' })
        }
    });

})

app.delete('/topic', (req, res) => {

    res.json({ msg: 'Not available' })

})

//-----------------------------------------------------

server.listen(port, function () {
    console.log('Message broker service is listening at port %d', port);
});

//----------------------------------------------------------------------------

// Helper --------------------------------------------------------------------

function formatValue(obj) {

    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }

}

//----------------------------------------------------------------------------

//Socket IO ------------------------------------------------------------------

io.on('connection', function (socket) {

    let consumer = null
    console.log("New connection found")

    socket.on("SUBSCRIBE_TOPIC", data => {

        const topic = data.topic

        if (consumer != null) {

            consumer.addTopics(new Array(data.topic))

        } else {

            consumer = new Consumer(client, [{ topic: topic, partition: 0 }], { autoCommit: false })

            consumer.on('message', function (message) {
                socket.emit("NEW_MESSAGE", { topic: message.topic, message: formatValue(message.value) })
            });
            consumer.on('error', function (err) {
                console.log(`Error: ${err}`);
            })

            consumer.on('offsetOutOfRange', function (err) {
                console.log(`Error: ${err}`);
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

            consumer = new Consumer(client, data.topics.map(topic => Object.create({ topic: topic, partition: 0 })), { autoCommit: false })

            consumer.on('message', function (message) {
                socket.emit("NEW_MESSAGE", { topic: message.topic, message: formatValue(message.value) })
            });
            consumer.on('error', function (err) {
                console.log(`Error: ${err}`);
            })

            consumer.on('offsetOutOfRange', function (err) {
                console.log(`Error: ${err}`);
            })

        }


    })

    socket.on("NEW_MESSAGE", data => {

        const topic = data.topic, message = JSON.stringify(data.message)
        sendMessage(topic, message)

    })

    socket.on('disconnect', function () {

        console.log("Client disconnected")

    })


})

//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------


