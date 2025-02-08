import { WebPlugin } from "@capacitor/core";

import type { CapacitorFlashPlugin } from "./definitions";

export class CapacitorFlashWeb
  extends WebPlugin
  implements CapacitorFlashPlugin
{
  isAvailable(): Promise<{ value: boolean }> {
    return Promise.resolve({ value: false });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switchOn(_options: { intensity?: number }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  switchOff(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  isSwitchedOn(): Promise<{ value: boolean }> {
    throw new Error("Method not implemented.");
  }

  toggle(): Promise<{ value: boolean }> {
    throw new Error("Method not implemented.");
  }
}
