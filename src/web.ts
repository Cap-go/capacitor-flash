import { WebPlugin } from '@capacitor/core';

import type { CapacitorFlashPlugin } from './definitions';

export class CapacitorFlashWeb extends WebPlugin implements CapacitorFlashPlugin {
  private stream: MediaStream | null = null;
  private track: MediaStreamTrack | null = null;
  private torchOn = false;

  async isAvailable(): Promise<{ value: boolean }> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        return { value: false };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
      const hasTorch = capabilities?.torch === true;

      // Stop the test stream
      track.stop();

      return { value: hasTorch };
    } catch {
      return { value: false };
    }
  }

  async switchOn(_options: { intensity?: number }): Promise<void> {
    try {
      // If we already have a stream with torch on, just return
      if (this.stream && this.torchOn) {
        return;
      }

      // Get camera stream if we don't have one
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        this.track = this.stream.getVideoTracks()[0];
      }

      // Apply torch constraint
      await this.track?.applyConstraints({
        advanced: [{ torch: true } as MediaTrackConstraintSet],
      });
      this.torchOn = true;
    } catch (e) {
      throw new Error(`Failed to switch on torch: ${e}`);
    }
  }

  async switchOff(): Promise<void> {
    try {
      if (this.track) {
        // Turn off torch by stopping the track
        this.track.stop();
        this.track = null;
      }
      if (this.stream) {
        this.stream = null;
      }
      this.torchOn = false;
    } catch (e) {
      throw new Error(`Failed to switch off torch: ${e}`);
    }
  }

  async isSwitchedOn(): Promise<{ value: boolean }> {
    return { value: this.torchOn };
  }

  async toggle(): Promise<{ value: boolean }> {
    if (this.torchOn) {
      await this.switchOff();
    } else {
      await this.switchOn({});
    }
    return { value: this.torchOn };
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}
