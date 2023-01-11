/* eslint-disable no-console */
import * as fs from 'fs';
export const lastModified = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.getTime();
    }
    catch (e) {
        console.warn(`Unable to get last modified date for file ${filePath}`);
        return new Date(-8640000000000000).getTime();
    }
};
