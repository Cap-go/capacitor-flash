# capacitor-flash
  <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo 🚀</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Fix your annoying bug now, Hire a Capacitor expert 💪</a></h2>
</div>

Switch the Flashlight / Torch of your device.

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

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isAvailable()

```typescript
isAvailable() => any
```

Checks if flashlight is available

**Returns:** <code>any</code>

--------------------


### switchOn(...)

```typescript
switchOn(options: { intensity?: number; }) => any
```

Turns the flashlight on

| Param         | Type                                 |
| ------------- | ------------------------------------ |
| **`options`** | <code>{ intensity?: number; }</code> |

**Returns:** <code>any</code>

--------------------


### switchOff()

```typescript
switchOff() => any
```

Turns the flashlight off

**Returns:** <code>any</code>

--------------------


### isSwitchedOn()

```typescript
isSwitchedOn() => any
```

Checks if the flashlight is turned on or off

**Returns:** <code>any</code>

--------------------


### toggle()

```typescript
toggle() => any
```

Toggle the flashlight

**Returns:** <code>any</code>

--------------------

</docgen-api>
