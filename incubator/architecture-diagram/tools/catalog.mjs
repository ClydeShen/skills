// Compatibility entry for historical fixture tools. Runtime source lives in the candidate.
import { existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { catalogMain } from '../candidate/architecture-diagram/scripts/catalog.mjs';
export * from '../candidate/architecture-diagram/scripts/catalog.mjs';

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) catalogMain(process.argv.slice(2));
