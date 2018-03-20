var socketClient = require('socket.io-client')

var brokerAddress = require('../config.js').messageBrokerAddress
var socket = socketClient.connect(brokerAddress)

var core = require('../core')

var isConnected = false

socket.on('connect', function (socket) {

    console.log("Message broker connected!")
    isConnected = true

})

socket.on('error', function (error) {

    console.log(error)

})

socket.on('NEW_MESSAGE', function (data) {

})

socket.on('disconnect', function () {

    isConnected = false
    console.log("Message broker disconnected!")
    setTimeout(() => {

        console.log("Attemping connecting to message broker ...")
        socket.socketClient.connect(brokerAddresss)

    }, 10000)

})


exports.sendMessage = function (message) {

    if (!isConnected)
        console.log("Message broker not available now. Couldn't send message")
    else
        socket.compress(true).emit('NEW_MESSAGE', message)

}