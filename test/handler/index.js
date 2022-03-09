let counter = 0;

exports.handler = async () =>
  new Promise((resolve) => {
    resolve(++counter);
  });