import fs from "node:fs";
import path from "node:path";

export const DEFAULT_SKIP_DIRS = [
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

export function resolveSafePluginDir(rawDir, label) {
  const cwd = fs.realpathSync(process.cwd());
  const resolved = path.resolve(cwd, rawDir ?? ".");
  let pluginDir;
  try {
    pluginDir = fs.realpathSync(resolved);
  } catch {
    console.error(`[${label}] ERROR: plugin dir not found: ${resolved}`);
    process.exit(2);
  }
  const rel = path.relative(cwd, pluginDir);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    console.error(`[${label}] ERROR: plugin dir must stay under ${cwd}`);
    process.exit(2);
  }
  return pluginDir;
}

export function parsePluginDirArg(argv, label) {
  let dir = resolveSafePluginDir(".", label);
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" || a === "--pluginDir") {
      const raw = argv[++i];
      if (raw == null || raw === "" || raw.startsWith("-")) {
        console.error(`[${label}] ERROR: missing value for ${a}`);
        process.exit(2);
      }
      dir = resolveSafePluginDir(raw, label);
    }
  }
  return dir;
}

function pathInsideRoot(targetPath, rootPath) {
  const root = fs.realpathSync(rootPath);
  let realTarget;
  try {
    realTarget = fs.realpathSync(path.resolve(targetPath));
  } catch {
    return null;
  }
  const rel = path.relative(root, realTarget);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return realTarget;
}

export function createPluginFs(pluginDir) {
  const root = fs.realpathSync(pluginDir);

  function boundedPath(p) {
    return pathInsideRoot(p, root);
  }

  function readText(p) {
    const safe = boundedPath(p);
    if (!safe) return "";
    try {
      return fs.readFileSync(safe, "utf8");
    } catch {
      return "";
    }
  }

  function exists(p) {
    const safe = boundedPath(p);
    if (!safe) return false;
    try {
      fs.accessSync(safe);
      return true;
    } catch {
      return false;
    }
  }

  function walkFiles(scanRoot, exts, skipDirs) {
    const skip = new Set(skipDirs);
    const boundedRoot = boundedPath(scanRoot);
    if (!boundedRoot) return [];
    const out = [];
    const stack = [boundedRoot];
    while (stack.length) {
      const dir = stack.pop();
      let entries;
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const e of entries) {
        const child = path.join(dir, e.name);
        const safeChild = boundedPath(child);
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
    out.sort();
    return out;
  }

  function listFiles(predicate) {
    let entries;
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      return [];
    }
    const out = [];
    for (const e of entries) {
      if (!e.isFile() || !predicate(e.name)) continue;
      const safe = boundedPath(path.join(root, e.name));
      if (safe) out.push(safe);
    }
    out.sort();
    return out;
  }

  return { root, readText, exists, walkFiles, listFiles };
}
