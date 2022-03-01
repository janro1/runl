require('esbuild')
  .build({
    entryPoints: [
      './src/index.ts',
      './src/execute/execute-lambda.ts',
      './src/run/run-lambda.ts'
    ],
    bundle: true,
    outdir: './dist',
    platform: 'node'
  })
  .catch(() => process.exit(1));
