//serviceUrl hiện tại chỉ là tạm thời, sau khi code xong, có port chính thức
//thì vô đây sửa

module.exports = [{
    type: 'api',
    clientUrl: '/accounts',
    serviceUrl: 'http://localhost:7000'
  }, {
    type: 'api',
    clientUrl: '/products',
    serviceUrl: 'http://localhost:7002'
  }, {
    type: 'api',
    clientUrl: '/employees',
    serviceUrl: 'http://localhost:7003'
  }, {
    type: 'api',
    clientUrl: '/promotions',
    serviceUrl: 'http://localhost:7004'
  }, {
    type: 'api',
    clientUrl: '/watchlists',
    serviceUrl: 'http://localhost:7005'
  }, {
    type: 'socket',
    clientUrl: '/notifications',
    serviceUrl: 'http://localhost:7006'
  }, {
    type: 'api',
    clientUrl: '/notifications',
    serviceUrl: 'http://localhost:7006'
  }, {
    type: 'api',
    clientUrl: '/comments',
    serviceUrl: 'http://localhost:7007'
  }, {
    type: 'api',
    clientUrl: '/bills',
    serviceUrl: 'http://localhost:7008'
  }
]