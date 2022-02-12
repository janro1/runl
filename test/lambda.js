const https = require('https');

let url = 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html';

exports.handler = async () => {
  const promise = new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        resolve(res.statusCode);
      })
      .on('error', (e) => {
        reject(Error(e));
      });
  });
  return promise;
};
