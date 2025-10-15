import { registerPlugin } from '@capacitor/core';

import type { CapacitorFlashPlugin } from './definitions';

const CapacitorFlash = registerPlugin<CapacitorFlashPlugin>('CapacitorFlash', {
  web: () => import('./web').then((m) => new m.CapacitorFlashWeb()),
});

export * from './definitions';
export { CapacitorFlash };
