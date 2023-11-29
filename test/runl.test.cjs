const fs = require('fs');
const path = require('path');
const { Lambda } = require('../dist/cjs/index.cjs');

const touchFile = (filePath) => {
  const newDate = new Date();
  fs.utimesSync(filePath, newDate, newDate);
};

describe('runl', () => {
  let lambda = undefined;
  const modes = ['Ephemeral', 'Persistent'];

  afterEach(() => {
    if (lambda && lambda.options.mode === 'Persistent') {
      lambda.stop();
    }
  });

  it.each(modes)('returns status code 200 for mode: %s', async (mode) => {
    lambda = new Lambda({
      mode: mode,
      lambdaPath: __dirname + '/handler/do-request.cjs'
    });

    const result1 = await lambda.execute();
    const result2 = await lambda.execute();

    expect(result1).toBe(200);
    expect(result2).toBe(200);
  });

  it('handles exceptions properly', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/fail.cjs'
    });

    await expect(async () => {
      await lambda.execute();
    }).rejects.toThrowError('errare humanum est');

    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/fail-callback.cjs'
    });

    await expect(async () => {
      await lambda.execute();
    }).rejects.toThrowError('errare humanum est');
  });

  it('does not swallow errors while requiring the handler code', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/broken.cjs'
    });

    await expect(async () => {
      await lambda.execute();
    }).rejects.toThrow('Unable to require lambda handler');
  });

  it('works with non-async handlers', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/callback.cjs'
    });

    const result = await lambda.execute();

    expect(result).toBe(403);
  });

  it('uses the lambdHandler option correctly', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/non-default.cjs',
      lambdaHandler: 'go'
    });

    const result = await lambda.execute();

    expect(result).toBe('here');
  });

  it('passes the environment variables', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/use-env.cjs',
      environment: {
        TEST: 'test'
      }
    });

    const result = await lambda.execute();

    expect(result).toBe('test');
  });

  it('passes the event parameter', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/use-event.cjs'
    });

    const result = await lambda.execute({ action: 'open' });

    expect(result).toBe('open');
  });

  it('respects the lambda timeout', async () => {
    lambda = new Lambda({
      mode: 'Ephemeral',
      lambdaPath: __dirname + '/handler/timeout.cjs',
      lambdaTimeout: 2000
    });

    await expect(async () => {
      await lambda.execute();
    }).rejects.toStrictEqual({ error: 'lambda timeout' });
  });

  it('auto reloads the lambda handler', async () => {
    const lambdaPath = __dirname + '/handler/auto-reload.cjs';

    lambda = new Lambda({
      mode: 'Persistent',
      autoReload: true,
      lambdaPath
    });

    const result1 = await lambda.execute();
    const result2 = await lambda.execute();

    expect(result1).toBe(1);
    expect(result2).toBe(2);

    touchFile(lambdaPath);

    const result3 = await lambda.execute();

    expect(result3).toBe(1);
  });
});
