import { registerPlugin } from '@capacitor/core';

import type { CapacitorFloashPlugin } from './definitions';

const CapacitorFloash = registerPlugin<CapacitorFloashPlugin>(
  'CapacitorFloash',
  {
    web: () => import('./web').then(m => new m.CapacitorFloashWeb()),
  },
);

export * from './definitions';
export { CapacitorFloash };
