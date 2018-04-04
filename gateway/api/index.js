/*cách hoạt động: vd:
  client gọi https://localhost:8080/accounts/authenticate thì
  gateway chuyển sang https://localhost:3001/authenticate hay
  client gọi https://localhost:8080/accounts/khoavu/promote thì
  gateway chuyển sang https://localhost:3001/khoavu/promote.
  Nói tóm lại là lấy đoạn sau https://localhost:8080/accounts gắn
  vào https://localhost:3001.
  Header, body và phương thức ko đổi.
*/

var proxy = require('http-proxy-middleware');
var jwtkey = require('../config.js').secretjwt
var jwt = require('jsonwebtoken')

const parseToken = (proxyReq, req) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], jwtkey, (err, decode) => {
        if (err) {
          proxyReq.account = undefined;
        }
        else {
          proxyReq.account = decode;
        }
      }
    )
  } else {
    proxyReq.account = undefined;
  }
}

module.exports = (app, db) => {

  /*app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], jwtkey, (err, decode) => {
          if (err) 
            req.account = undefined;
          else {
            req.account = decode;
          }
        }
      )
    } else {
      req.account = undefined;
    }
    console.log(req.account)
    next();
  })*/

  db.forEach(service => {
    if (service.type === 'api') {
      app.use(service.clientUrl, proxy({
        target: service.serviceUrl,
        changeOrigin: true,
        pathRewrite: {
          [`^${service.clientUrl}`]: '/'
        },
        onProxyReq: (proxyReq, req, res) => {
          parseToken(proxyReq, req);
        }
      }))
    }
  });

  app.post('/', (req, res) => {
    res.json({'ok': 'OK'});
  })
}