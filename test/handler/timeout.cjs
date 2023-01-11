exports.handler = async () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, 60000);
  });
