const https = require('https');

exports.handler = async () =>
  new Promise((resolve, reject) => {
    https
      .get('https://example.com', (res) => {
        resolve(res.statusCode);
      })
      .on('error', (e) => {
        reject(Error(e));
      });
  });
