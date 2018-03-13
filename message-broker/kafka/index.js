var kafka = require('kafka-node')
var client = new kafka.Client
var _ = require('lodash')

process.on('SIGTERM', function () {

    client.close()

})

//Producer initialization -----------------------------------------------

var Producer = kafka.Producer,
    producer = new Producer(client)

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
})

//------------------------------------------------------------------------

var Consumer = kafka.Consumer

//METHOD ------------------------------------------------

exports.getConsumer = topics => {

    const consumer = new Consumer(client, topics.map(topic => Object.create({ topic: topic, partition: 0 })), { autoCommit: false })

    consumer.on('error', function (err) {
        console.log(`Error: ${err}`);
    })

    consumer.on('offsetOutOfRange', function (err) {
        console.log(`Error: ${err}`);
    })

    return consumer

}

exports.sendMessage = function (topic, message) {

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

exports.getTopics = () => {

    return new Promise((resolve, reject) => {

        client.loadMetadataForTopics([], function (error, results) {
            if (error) {
                console.log(error)
                return reject()
            }
            resolve(Object.keys(_.get(results, '1.metadata')))
        });

    })

}

exports.createTopic = topic => {

    return new Promise((resolve, reject) => {

        producer.createTopics(new Array(topic), true, function (err, data) {
            if (err) {
                console.log(err)
                reject()
            } else {
                console.log(`Topic ${topic} has been created`)
                resolve()
            }
        });

    })

}

//------------------------------------------------------------------------





