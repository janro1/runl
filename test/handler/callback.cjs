const https = require('https');

exports.handler =  function(event, context, callback) {
  https.get("https://docs.aws.amazon.com/lambda/latest/dg/welcome.html", (res) => {
    callback(null, res.statusCode)
  }).on('error', (e) => {
    callback(Error(e))
  })
}