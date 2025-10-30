# capacitor-flash
  <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_flash"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_flash"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>
Switch the Flashlight / Torch of your device.

## Why Capacitor Flash?

A simple, **free**, and **lightweight** flashlight control plugin:

- **Intensity control** - Adjust brightness levels (iOS with configurable intensity)
- **Status checking** - Query flashlight availability and current state
- **Toggle support** - Simple on/off switching with toggle method
- **Universal compatibility** - Works across all iOS and Android devices with flash hardware
- **Modern package management** - Supports both Swift Package Manager (SPM) and CocoaPods (SPM-ready for Capacitor 8)
- **Zero dependencies** - Minimal footprint, no bloat

Perfect for QR scanner apps, emergency torch features, camera apps, and utility tools.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/flash/

## Install

```bash
npm install @capgo/capacitor-flash
npx cap sync
```

## iOS

Works out of the box

## Android

1. Declare permissions in your app's `AndroidManifest.xml` file

```xml
<!-- Permissions: Allows access to flashlight -->
<uses-permission android:name="android.permission.CAMERA" android:maxSdkVersion="23" />
<uses-permission android:name="android.permission.FLASHLIGHT" />

<!-- Actual Hardware Features Used-->
<uses-feature android:name="android.hardware.camera.flash" android:required="true" />
```

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
