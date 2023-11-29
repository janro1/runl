#!/usr/bin/env node

import { run } from './cli-base.ts';
import { Lambda } from './index.cjs.ts';

(async (): Promise<void> => {
  await run((args) => new Lambda(args));
})();
