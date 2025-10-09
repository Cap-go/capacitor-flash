# Example App for `@capgo/capacitor-flash`

This Vite project links directly to the local plugin source so you can exercise the native APIs while developing.

## Actions in this playground

- **Check availability** – Calls isAvailable() to determine if the device exposes a torch.
- **Toggle flash** – Toggles the flashlight state. Requires native platform with torch hardware.
- **Switch on with intensity** – Turns on the flashlight with the specified intensity.
- **Switch off** – Turns the flashlight off.

## Getting started

```bash
npm install
npm start
```

Add native shells with `npx cap add ios` or `npx cap add android` from this folder to try behaviour on device or simulator.
