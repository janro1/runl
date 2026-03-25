const http = require('http');

exports.handler = async () =>
  new Promise((resolve, reject) => {
    http
      .get('http://example.net', (res) => {
        resolve(res.statusCode);
      })
      .on('error', (e) => {
        reject(Error(e));
      });
  });
