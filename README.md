# capacitor-flash

Switch the Flashlight / Torch of your device.

## Install

```bash
npm install capacitor-flash
npx cap sync
```

## API

<docgen-index>

* [`isAvailable()`](#isavailable)
* [`switchOn(...)`](#switchon)
* [`switchOff()`](#switchoff)
* [`isSwitchedOn()`](#isswitchedon)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isAvailable()

```typescript
isAvailable() => Promise<{ value: boolean; }>
```

Checks if flashlight is available

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

--------------------


### switchOn(...)

```typescript
switchOn(options: { intensity?: number; }) => Promise<void>
```

Turns the flashlight on

| Param         | Type                                 |
| ------------- | ------------------------------------ |
| **`options`** | <code>{ intensity?: number; }</code> |

--------------------


### switchOff()

```typescript
switchOff() => Promise<void>
```

Turns the flashlight off

--------------------


### isSwitchedOn()

```typescript
isSwitchedOn() => Promise<{ value: boolean; }>
```

Checks if the flashlight is turned on or off

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

--------------------

</docgen-api>
