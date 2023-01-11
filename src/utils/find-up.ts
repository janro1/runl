import * as path from 'path';
import * as fs from 'fs';

export const findUp = (
  currentPath: string,
  fileName: string
): string | undefined => {
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
