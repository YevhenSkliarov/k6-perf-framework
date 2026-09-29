declare module 'https://jslib.k6.io/*';
/*
we need this to avoid errors with such imports in TypeScript, since the module is not a local file and TypeScript cannot find its type definitions. This declaration tells TypeScript to treat any import from 'https://jslib.k6.io/*' as a module with any type, allowing us to use it without type errors.
import { expect } from 'https://jslib.k6.io/k6-testing/0.6.1/index.js';
*/ 