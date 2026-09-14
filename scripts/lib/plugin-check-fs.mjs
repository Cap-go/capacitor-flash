import fs from "node:fs";
import path from "node:path";

export const DEFAULT_SKIP_DIR_NAMES = [
  "node_modules",
  "dist",
  "build",
  ".build",
  ".gradle",
  "Pods",
  "DerivedData",
  ".swiftpm",
  ".git",
];

function isMissingFileError(err) {
  return (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err.code === "ENOENT" || err.code === "ENOTDIR")
  );
}

function establishTrustedRoot(pluginDirInput) {
  const cwd = fs.realpathSync(process.cwd());
  let root;
  try {
    root = fs.realpathSync(path.resolve(String(pluginDirInput)));
  } catch {
    return null;
  }
  const rel = path.relative(cwd, root);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return root;
}

function resolveUnderRoot(targetPath, root) {
  let resolved;
  try {
    resolved = fs.realpathSync(path.resolve(targetPath));
  } catch {
    return null;
  }
  const rel = path.relative(root, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return resolved;
}

export function resolveCwdPluginDir() {
  return fs.realpathSync(process.cwd());
}

export function resolvePluginDirFromArgv(argv, label) {
  let dir = resolveCwdPluginDir();
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" || a === "--pluginDir") {
      const raw = argv[++i];
      if (raw == null || raw === "" || raw.startsWith("-")) {
        console.error(`[${label}] ERROR: missing value for ${a}`);
        process.exit(2);
      }
      if (raw.includes("\0") || raw.includes("..")) {
        console.error(`[${label}] ERROR: invalid plugin dir: ${raw}`);
        process.exit(2);
      }
      const candidate = path.resolve(dir, raw);
      const trusted = establishTrustedRoot(candidate);
      if (!trusted) {
        console.error(`[${label}] ERROR: plugin dir must stay under ${dir}`);
        process.exit(2);
      }
      dir = trusted;
    }
  }
  return dir;
}

export function createPluginFs(pluginDirInput) {
  const root = establishTrustedRoot(pluginDirInput);
  if (!root) {
    throw new Error("plugin dir must stay under the current working directory");
  }

  function readText(filePath) {
    const safe = resolveUnderRoot(filePath, root);
    if (!safe) return "";
    try {
      return fs.readFileSync(safe, "utf8");
    } catch (err) {
      if (isMissingFileError(err)) return "";
      throw err;
    }
  }

  function exists(filePath) {
    const safe = resolveUnderRoot(filePath, root);
    if (!safe) return false;
    try {
      fs.accessSync(safe);
      return true;
    } catch (err) {
      if (isMissingFileError(err)) return false;
      throw err;
    }
  }

  function walkFiles(scanRoot, exts, skipDirNames = DEFAULT_SKIP_DIR_NAMES) {
    const skip = new Set(skipDirNames);
    const boundedRoot = resolveUnderRoot(scanRoot, root);
    if (!boundedRoot) return [];
    const out = [];
    const stack = [boundedRoot];
    while (stack.length) {
      const dir = stack.pop();
      collectFilesInDir(dir, skip, exts, root, out, stack);
    }
    out.sort((a, b) => a.localeCompare(b));
    return out;
  }

  function listRootFiles(predicate) {
    const out = [];
    let entries;
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch (err) {
      if (isMissingFileError(err)) return out;
      throw err;
    }
    for (const e of entries) {
      if (!e.isFile() || !predicate(e.name)) continue;
      const safe = resolveUnderRoot(path.join(root, e.name), root);
      if (safe) out.push(safe);
    }
    out.sort((a, b) => a.localeCompare(b));
    return out;
  }

  return { root, readText, exists, walkFiles, listRootFiles };
}

function collectFilesInDir(dir, skip, exts, root, out, stack) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (isMissingFileError(err)) return;
    throw err;
  }
  for (const e of entries) {
    const child = path.join(dir, e.name);
    const safeChild = resolveUnderRoot(child, root);
    if (!safeChild) continue;
    if (e.isDirectory()) {
      if (skip.has(e.name)) continue;
      stack.push(safeChild);
      continue;
    }
    if (!e.isFile()) continue;
    for (const ext of exts) {
      if (e.name.endsWith(ext)) {
        out.push(safeChild);
        break;
      }
    }
  }
}

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
