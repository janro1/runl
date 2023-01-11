exports.handler = async () =>
  new Promise((resolve) => {
    resolve(process.env.TEST);
  });
