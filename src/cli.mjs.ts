#!/usr/bin/env node

import { run } from './cli-base.ts';
import { Lambda } from './index.mjs.ts';

await run((args) => new Lambda(args));
