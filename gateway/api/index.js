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

module.exports = (app, db) => {

  db.forEach(service => {
    if (service.type === 'api') {
      app.use(service.clientUrl, proxy({
        target: service.serviceUrl,
        changeOrigin: true,
        pathRewrite: {
          [`^${service.clientUrl}`]: '/'
        }
      }))
    }
  });

  app.post('/', (req, res) => {
    res.json({'ok': 'OK'});
  })
}