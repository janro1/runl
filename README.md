# RunL

**Run** AWS **L**ambda functions locally in node.

## How does it work?

Instead of loading the lambda handler directly into the current node process,
`runl` forks a child process for every request / call to execute. The child
process requires the handler code, executes it and passes the result back to the
calling process.

Pros:

- Better isolation. Globals, such as environment variables or globally patched
  modules, like `https` (necessary for X-Ray support), are contained in the
  child process.
- Memory leaks are avoided as re-requiring the handler code in a single node
  process is ruled out.
- Native support for lambda timeout.

Cons:

- Probably slower, as forking a new node process for every request and sending
  the result back to the parent process adds overhead

## Do not use it in production!

`runl` was written to be used in a dev server only.

## Do not try do bundle it

`runl` can't be bundled. You can bundle the execute funtion into your dev
server, but for a sucessful execution `runl` always needs the node module to be
installed.

## How to

```
const { execute } = require('runl');

const result = await execute({
    lambdaPath: './lambda.js',
    environment: {
      BASE_URL: '/'
    }
});
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
