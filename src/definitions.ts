/**
 * Capacitor Flash Plugin for controlling device flashlight/torch.
 *
 * @since 1.0.0
 */
export interface CapacitorFlashPlugin {
  /**
   * Checks if flashlight is available on the device.
   *
   * @returns Promise that resolves with availability status
   * @throws Error if checking availability fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { value } = await CapacitorFlash.isAvailable();
   * if (value) {
   *   console.log('Flashlight is available');
   * }
   * ```
   */
  isAvailable(): Promise<{ value: boolean }>;

  /**
   * Turns the flashlight on.
   *
   * @param options - Optional configuration including light intensity
   * @returns Promise that resolves when flashlight is turned on
   * @throws Error if flashlight is not available or turning on fails
   * @since 1.0.0
   * @example
   * ```typescript
   * // Turn on at full brightness
   * await CapacitorFlash.switchOn({ intensity: 1.0 });
   *
   * // Turn on at half brightness
   * await CapacitorFlash.switchOn({ intensity: 0.5 });
   * ```
   */
  switchOn(options: { intensity?: number }): Promise<void>;

  /**
   * Turns the flashlight off.
   *
   * @returns Promise that resolves when flashlight is turned off
   * @throws Error if turning off fails
   * @since 1.0.0
   * @example
   * ```typescript
   * await CapacitorFlash.switchOff();
   * ```
   */
  switchOff(): Promise<void>;

  /**
   * Checks if the flashlight is currently turned on or off.
   *
   * @returns Promise that resolves with the current flashlight state
   * @throws Error if checking state fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { value } = await CapacitorFlash.isSwitchedOn();
   * console.log('Flashlight is on:', value);
   * ```
   */
  isSwitchedOn(): Promise<{ value: boolean }>;

  /**
   * Toggle the flashlight on or off.
   *
   * @returns Promise that resolves with the new flashlight state
   * @throws Error if toggling fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { value } = await CapacitorFlash.toggle();
   * console.log('Flashlight toggled, now on:', value);
   * ```
   */
  toggle(): Promise<{ value: boolean }>;

  /**
   * Get the native Capacitor plugin version.
   *
   * @returns Promise that resolves with the plugin version
   * @throws Error if getting the version fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { version } = await CapacitorFlash.getPluginVersion();
   * console.log('Plugin version:', version);
   * ```
   */
  getPluginVersion(): Promise<{ version: string }>;
}
