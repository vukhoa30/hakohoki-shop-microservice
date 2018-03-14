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
  server.post('/', (req, res) => {
    res.json({'ok': 'OK'});
  })

  server.on('NotFound', async (req, res, err, cb) => {
    console.log(req.body);
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
        //var rslt = await request(directUrl);
        var options = {
          method: req.method,
          uri: directUrl,
          body: req.body,
          header: req.headers
        };
        console.log(options);
        var rslt = await request(options);
        console.log(rslt);
        res.json(JSON.parse(rslt));
      }
      catch (err) {
        res.json({ 
          ok: false,
          msg: 'Request failed. Maybe the the request is bad or service is not on.',
          err,
          directUrl
        })
      }
    }
    else {
      res.json({ 'status': 'sumting wong' });
    }
  })
}