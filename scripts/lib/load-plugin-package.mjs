import path from "node:path";

export function loadCapacitorPluginPackage(fsApi, label) {
  const pkgPath = path.join(fsApi.root, "package.json");
  if (!fsApi.exists(pkgPath)) {
    console.error(`[${label}] ERROR: missing package.json in ${fsApi.root}`);
    process.exit(2);
  }

  let pkg;
  try {
    pkg = JSON.parse(fsApi.readText(pkgPath));
  } catch (e) {
    console.error(`[${label}] ERROR: invalid package.json (${pkgPath}): ${e?.message || e}`);
    process.exit(2);
  }

  const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
  return { pkg, cap, pkgPath };
}
