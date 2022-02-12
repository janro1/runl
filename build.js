require('esbuild')
  .build({
    entryPoints: ['./src/index.ts', './src/execute.ts'],
    bundle: true,
    outdir: './dist',
    platform: 'node'
  })
  .catch(() => process.exit(1));
