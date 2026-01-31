# capacitor-flash
  <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_flash"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_flash"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>
Switch the Flashlight / Torch of your device.

## Why Capacitor Flash?

A simple, **free**, and **lightweight** flashlight control plugin:

- **Intensity control** - Adjust brightness levels (iOS and Android 13+)
- **Status checking** - Query flashlight availability and current state
- **Toggle support** - Simple on/off switching with toggle method
- **Universal compatibility** - Works across iOS, Android, and web (Chrome on mobile devices)
- **Modern package management** - Supports both Swift Package Manager (SPM) and CocoaPods (SPM-ready for Capacitor 8)
- **Zero dependencies** - Minimal footprint, no bloat

Perfect for QR scanner apps, emergency torch features, camera apps, and utility tools.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/flash/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

```bash
npm install @capgo/capacitor-flash
npx cap sync
```

## iOS

Works out of the box

## Android

Works out of the box. No permissions are required since the `CameraManager.setTorchMode()` API (introduced in Android 6.0) does not require camera permission.

Optionally, you can declare the flash hardware feature in your `AndroidManifest.xml`:

```xml
<uses-feature android:name="android.hardware.camera.flash" android:required="false" />
```

## Web

Works in Chrome and Chromium-based browsers on mobile devices. Uses the MediaDevices API with torch constraint. Call `isAvailable()` first to check if torch control is supported on the current browser/device.

## API

<docgen-index>

* [`isAvailable()`](#isavailable)
* [`switchOn(...)`](#switchon)
* [`switchOff()`](#switchoff)
* [`isSwitchedOn()`](#isswitchedon)
* [`toggle()`](#toggle)
* [`getPluginVersion()`](#getpluginversion)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Capacitor Flash Plugin for controlling device flashlight/torch.

### isAvailable()

```typescript
isAvailable() => Promise<{ value: boolean; }>
```

Checks if flashlight is available on the device.

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### switchOn(...)

```typescript
switchOn(options: { intensity?: number; }) => Promise<void>
```

Turns the flashlight on.

| Param         | Type                                 | Description                                        |
| ------------- | ------------------------------------ | -------------------------------------------------- |
| **`options`** | <code>{ intensity?: number; }</code> | - Optional configuration including light intensity |

**Since:** 1.0.0

--------------------


### switchOff()

```typescript
switchOff() => Promise<void>
```

Turns the flashlight off.

**Since:** 1.0.0

--------------------


### isSwitchedOn()

```typescript
isSwitchedOn() => Promise<{ value: boolean; }>
```

Checks if the flashlight is currently turned on or off.

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### toggle()

```typescript
toggle() => Promise<{ value: boolean; }>
```

Toggle the flashlight on or off.

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

**Since:** 1.0.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 1.0.0

--------------------

</docgen-api>
