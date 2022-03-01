# RunL

**Run** AWS **L**ambda functions locally in node.

## How does it work?

Instead of loading the lambda handler directly into the current node process,
`RunL` forks a child process in which the handler is executed. To execute the
handler the child process requires the handler code, executes it and passes the
result back to the parent process.

Pros:

- Better isolation. Globals, such as environment variables or patched modules,
  like `https` (as required for AWS X-Ray support), are contained in the child
  process.
- Memory leaks are avoided.

Cons:

- Passing the handler function directly to RunL is not possible. Instead you
  need to pass the local file path to the handler

## Modes

RunL comes with two execution modes, `execute` and `run`. `execute` always forks
a new child process, executes the handler within this process and passes the
result to the parent process.

This has the advantage that every request runs totally isolated from every other
request. The disadvantage is, that the lambda handler code must always be newly
required inside the child process. This can take a few seconds if the handler is
several megabytes in size.

### How to use `execute`

```
const { execute } = require('runl');

const result = await execute({
    lambdaPath: './lambda.js',
    environment: {
      BASE_URL: '/'
    }
});
```

The `run` mode in contrast creates a long running fork for every handler /
handler path passed to it. So if you have three lambda handler, RunL will
maintain three forks in which the corresponding handlers are executed. The
advantage is that the handler code must _not_ be newly required on every
request, which can drastically reduce the request times in your dev server.

### How to use `run`

```
    const { run } = require('runl');

    const { execute, stop } = run();

    const request1 = execute({
      lambdaPath: __dirname + '/do-request-lambda.js'
    });

    const request2 = execute({
      lambdaPath: __dirname + '/do-request-lambda.js'
    });

    const [result1, result2] = await Promise.all([request1, request2]);

    // you can call stop() manually
    // to make RunL kill all child processes immediatly
    stop();
```

## Options

`execute` accepts the following options:

required:

- **lambdaPath**: absolute path to the lambda handler.

optional:

- **event**: an
  [APIGatewayProxyEvent](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format)
  passed to the lambda handler.
- **environment**: environment variables accessible in the lambda handler.

- **lambdaHandler**: the name of lambda handler, defaults to **handler**.

- **lambdaTimeout**: maximum execution time for the lambda, defaults to
  30.000ms.
