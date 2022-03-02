const { Lambda } = require('../dist/index');

describe('runl', () => {
  const modes = ['Ephemeral', 'Persistent'];

  it.each(modes)('returns status code 200 for mode: %s', async (mode) => {
    const lambda = new Lambda({
      mode: mode,
      lambdaPath: __dirname + '/handler/do-request.js'
    });

    const result1 = await lambda.execute();
    const result2 = await lambda.execute();

    if (mode === 'Persistent') {
      lambda.stop();
    }

    expect(result1).toBe(200);
    expect(result2).toBe(200);
  });

  it('uses the lambdHandler option correctly', async () => {
    const lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/non-default.js',
      lambdaHandler: 'go'
    });

    const result = await lambda.execute();

    expect(result).toBe('here');
  });

  it('passes the environment variables', async () => {
    const lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/use-env.js',
      environment: {
        TEST: 'test'
      }
    });

    const result = await lambda.execute();

    expect(result).toBe('test');
  });

  it('respects the lambda timeout', async () => {
    const lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/timeout.js',
      lambdaTimeout: 2000
    });

    await expect(async () => {
      await lambda.execute();
    }).rejects.toStrictEqual({ error: 'lambda timeout' });
  });
});
