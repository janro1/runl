exports.handler = async (event) =>
  new Promise((resolve) => {
    resolve(event.action)
  });
