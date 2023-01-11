import * as es from 'esbuild';

/**
 * @type {import('esbuild').BuildOptions}
 */
const common = {
  bundle: true,
  platform: 'node'
};

/**
 * @type {import('esbuild').BuildOptions}
 */
const cjsOptions = {
  ...common,
  format: 'cjs',
  tsconfig: './src/tsconfig.cjs.json'
};

/**
 * @type {import('esbuild').BuildOptions}
 */
const esmOptions = {
  ...common,
  format: 'esm',
  tsconfig: './src/tsconfig.esm.json'
};

es.build({
  ...cjsOptions,
  entryPoints: ['./src/index.cjs.ts'],
  outfile: './dist/cjs/index.cjs'
}).catch(() => process.exit(1));

es.build({
  ...cjsOptions,
  entryPoints: ['./src/run-lambda.cjs.ts'],
  outfile: './dist/cjs/run-lambda.cjs'
}).catch(() => process.exit(1));

es.build({
  ...esmOptions,
  entryPoints: ['./src/index.mjs.ts'],
  outfile: './dist/esm/index.mjs'
}).catch(() => process.exit(1));

es.build({
  ...esmOptions,
  entryPoints: ['./src/run-lambda.mjs.ts'],
  outfile: './dist/esm/run-lambda.mjs'
}).catch(() => process.exit(1));
