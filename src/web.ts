import { WebPlugin } from '@capacitor/core';

import type { CapacitorFloashPlugin } from './definitions';

export class CapacitorFloashWeb
  extends WebPlugin
  implements CapacitorFloashPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
