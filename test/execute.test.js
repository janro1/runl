const { execute } = require('../dist/index');

describe('execute', () => {
  it('returns status code 200', async () => {
    const request1 = await execute({
      lambdaPath: __dirname + '/handler/do-request.js',
      environment: {
        BASE_URL: '/'
      }
    });

    const request2 = await execute({
      lambdaPath: __dirname + '/handler/do-request.js'
    });

    const [result1, result2] = await Promise.all([request1, request2]);

    expect(result1).toBe(200);
    expect(result2).toBe(200);
  });

  it('uses the lambdHandler option correctly', async () => {
    const result = await execute({
      lambdaPath: __dirname + '/handler/non-default.js',
      lambdaHandler: 'go'
    });

    expect(result).toBe('here');
  });

  it('passes the environment variables', async () => {
    const result = await execute({
      lambdaPath: __dirname + '/handler/use-env.js',
      environment: {
        TEST: 'test'
      }
    });

    expect(result).toBe('test');
  });

  it('respects the lambda timeout', async () => {
    await expect(async () => {
      await execute({
        lambdaPath: __dirname + '/handler/timeout.js',
        lambdaTimeout: 2000
      });
    }).rejects.toStrictEqual({ error: 'lambda timeout' });
  });
});
