# RunL

**Run** AWS **L**ambda functions locally in node.

## How does it work?

Instead of loading the lambda handler directly into the current node process,
`RunL` forks a child process in which the handler is executed. To execute the
handler the child process requires the handler code, executes it and passes the
result back to the parent process.

Pros:

- Better isolation. Globals, such as environment variables or patched modules,
  are contained in the child process.
- No Memory leaks.

Cons:

- Passing the handler function to RunL is not possible. If you want to do this,
  better just import / require the handlers direcly into your dev-server.

## Modes

RunL comes with two execution modes, `Ephemeral` and `Persistent`. `Ephemeral`
always forks a new child process, executes the handler within this process and
passes the result to the parent process.

This has the advantage that every request runs totally isolated from every other
request. The disadvantage is, that the lambda handler code must always be newly
required inside the child process. This can take a few seconds if the handler is
several megabytes in size.

### How to use `Ephemeral` mode

```
const { Lambda } = require('runl');

const lambda = new Lambda({
  mode: 'Ephemeral',
  lambdaPath: __dirname + '/handler/example-handler.js'
});

lambda.execute({ path: '/index.html' });
```

The `Persistent` mode in contrast creates a long running fork that is reused for
every invocation. The advantage is that the handler code must _not_ be newly
required for every request, which can drastically reduce the request times in
your dev server.

### How to use `Persistent` mode

```
import { Lambda, LambdaMode } from 'runl';

const lambda = new Lambda({
  mode: LambdaMode.Persistent,
  lambdaPath: __dirname + '/handler/example-handler.js'
});

lambda.execute();

// you can manually stop the child process
// otherwise the child process lives
// until the parent process is terminated
lambda.stop();
```

## Options

The `Lambda` constructor accepts the following options:

required:

- **lambdaPath**: absolute path to the lambda handler.

optional:

- **environment**: environment variables accessible in the lambda handler.

- **lambdaHandler**: the name of lambda handler, defaults to **handler**.

- **lambdaTimeout**: maximum execution time for the lambda, defaults to
  30.000ms.

The `execute` method accepts only en event parameter:

- **event**: an
  [APIGatewayProxyEvent](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format)
  passed to the lambda handler.
