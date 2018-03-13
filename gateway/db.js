//serviceUrl hiện tại chỉ là tạm thời, sau khi code xong, có port chính thức
//thì vô đây sửa

module.exports = [{
    type: 'api',
    clientUrl: '/accounts',
    //serviceUrl: 'https://localhost:3001'
    serviceUrl: 'http://petstore-demo-endpoint.execute-api.com/petstore/pets'
  }, {
    type: 'api',
    clientUrl: '/products',
    serviceUrl: 'http://localhost:3002'
  }, {
    type: 'socket',
    service: '/notification',
    //serviceUrl: 'ws://localhost:3003'
    path: 'ws://demos.kaazing.com/echo'
  }
]