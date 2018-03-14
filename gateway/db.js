//serviceUrl hiện tại chỉ là tạm thời, sau khi code xong, có port chính thức
//thì vô đây sửa

module.exports = [{
    type: 'api',
    clientUrl: '/accounts',
    serviceUrl: 'https://localhost:7000'
    //serviceUrl: 'http://petstore-demo-endpoint.execute-api.com/petstore/pets'
  }, {
    type: 'api',
    clientUrl: '/products',
    serviceUrl: 'http://localhost:3002'
  }, {
    type: 'socket',
    clientUrl: '/notifications',
    serviceUrl: 'http://localhost:3003'
  }
]