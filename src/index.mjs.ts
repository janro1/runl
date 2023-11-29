import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { createRequire } from 'module';
import { type LambdaOptions, LambdaMode } from './types.js';
import { findUp } from './utils/find-up.js';
import { LambdaBase } from './lambda-base.js';

export { LambdaMode };

export class Lambda extends LambdaBase {
  protected readonly lambdaHander: string = './run-lambda.mjs';

  constructor(options: LambdaOptions) {
    super(options);
  }

  protected absoluteLambdaHandlerPath = (): string => {
    if (path.isAbsolute(this.options.lambdaPath)) {
      return this.options.lambdaPath;
    }

    const filename = url.fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);

    return path.join(dirname, this.options.lambdaPath);
  };

  protected findLambdaWrapperPath = (): string | undefined => {
    try {
      const requireFunc = createRequire(import.meta.url);

      // require will resolve the cjs path
      const cjsPath = path.dirname(requireFunc.resolve('runl'));
      return path.join(cjsPath.replace(/cjs$/, 'esm'), this.lambdaHander);
    } catch {
      const filename = url.fileURLToPath(import.meta.url);
      const dirname = path.dirname(filename);

      if (fs.existsSync(path.join(dirname, this.lambdaHander))) {
        return path.join(dirname, this.lambdaHander);
      }

      const pkgPath = findUp(process.cwd(), 'package.json');
      if (pkgPath) {
        const pkg = JSON.parse(path.join(pkgPath, 'package.json'));

        if (pkg.name === 'runl') {
          return path.join('dist', 'esm', this.lambdaHander);
        }
      }
    }

    return undefined;
  };
}
