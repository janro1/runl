const { execute } = require('../dist/index');

describe('can execute lambda.js', () => {
  it('return status code 403', async () => {
    const result = await execute({
      lambdaPath: __dirname + '/lambda.js',
      environment: {
        BASE_URL: '/'
      }
    });

    expect(result).toBe(403);
  });
});
