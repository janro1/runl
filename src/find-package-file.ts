import * as path from 'path';
import * as fs from 'fs';
import * as pkgJson from '../package.json';

declare const __webpack_require__: NodeRequire | undefined;
declare const __non_webpack_require__: NodeRequire | undefined;

const getRequireFunction = () =>
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

const findUp = (currentPath: string, fileName: string): string | undefined => {
  const nextPath = path.dirname(currentPath);
  if (path.dirname(currentPath) === path.dirname(nextPath)) {
    return undefined;
  }

  const filePath = path.join(currentPath, fileName);
  if (fs.existsSync(filePath)) {
    return currentPath;
  }

  return findUp(nextPath, fileName);
};

export const findPackageFile = (fileName: string): string | undefined => {
  const requireFunc = getRequireFunction();

  if (!requireFunc) {
    return undefined;
  }

  try {
    const filePath = requireFunc.resolve(pkgJson.name);

    return path.join(path.dirname(filePath), fileName);
  } catch {
    const pkgPath = findUp(process.cwd(), 'package.json');
    if (pkgPath) {
      const pkg = requireFunc(path.join(pkgPath, 'package.json'));

      if (pkg.name === pkgJson.name) {
        return path.join('dist', fileName);
      }
    }
  }

  return undefined;
};
