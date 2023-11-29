import * as fs from 'fs';
import * as path from 'path';
import { type LambdaOptions, LambdaMode } from './types.js';
import { findUp } from './utils/find-up.js';
import { LambdaBase } from './lambda-base.js';

declare const __webpack_require__: NodeRequire | undefined;
declare const __non_webpack_require__: NodeRequire | undefined;

export { LambdaMode };

export class Lambda extends LambdaBase {
  protected readonly lambdaHander: string = './run-lambda.cjs';

  constructor(options: LambdaOptions) {
    super(options);
  }

  protected absoluteLambdaHandlerPath = (): string =>
    path.join(__dirname, this.options.lambdaPath);

  protected getRequireFunction = (): NodeRequire => {
    const requireFunc =
      typeof __webpack_require__ === 'function'
        ? __non_webpack_require__
        : require;

    if (!requireFunc) {
      throw new Error('require not available');
    }

    return requireFunc;
  };

  protected findLambdaWrapperPath = (): string | undefined => {
    try {
      const requireFunc = this.getRequireFunction();
      const cjsPath = path.dirname(requireFunc.resolve('runl'));

      return path.join(cjsPath, this.lambdaHander);
    } catch {
      if (fs.existsSync(path.join(__dirname, this.lambdaHander))) {
        return path.join(__dirname, this.lambdaHander);
      }

      const pkgPath = findUp(process.cwd(), 'package.json');
      if (pkgPath) {
        const pkg = JSON.parse(path.join(pkgPath, 'package.json'));

        if (pkg.name === 'runl') {
          return path.join('dist', 'cjs', this.lambdaHander);
        }
      }
    }

    return undefined;
  };
}
