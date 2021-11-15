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

</docgen-api>
