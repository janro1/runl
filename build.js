require('esbuild')
  .build({
    entryPoints: ['./src/index.ts', './src/run-lambda.ts'],
    bundle: true,
    outdir: './dist',
    platform: 'node',
    tsconfig: './src/tsconfig.json'
  })
  .catch(() => process.exit(1));
