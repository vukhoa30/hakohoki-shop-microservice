/*cách hoạt động: vd:
  client gọi https://localhost:8080/accounts/authenticate thì
  gateway chuyển sang https://localhost:3001/authenticate hay
  client gọi https://localhost:8080/accounts/khoavu/promote thì
  gateway chuyển sang https://localhost:3001/khoavu/promote.
  Nói tóm lại là lấy đoạn sau https://localhost:8080/accounts gắn
  vào https://localhost:3001.
  Header, body và phương thức ko đổi.
*/

var request = require('request-promise-native')

module.exports = (server, db) => {
  server.get('/', (req, res) => {
    res.json({'ok': 'OK'});
  })

  server.on('NotFound', async (req, res, err, cb) => {
    //req.url có dạng '/accounts/...'
    var findingRslt = db.find(item => 
      item.type == 'api' &&
      req.url.indexOf(item.clientUrl) > -1
    )
    if (findingRslt) {
      var tail = req.url.substring(findingRslt.clientUrl.length)
      var directUrl = findingRslt.serviceUrl + tail;
      console.log('direct to: ' + directUrl);
      try {
        res.json(JSON.parse(await request(directUrl)));
      }
      catch (Exception) {
        res.json({ 
          ok: false,
          msg: 'Request failed. Maybe the service is not on.',
          directUrl
        })
      }
    }
    else {
      res.json({ 'status': 'sumting wong' });
    }
  })
}