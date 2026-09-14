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

  return { root, readText, exists, walkFiles };
}

function collectFilesInDir(dir, skip, exts, root, out, stack) {
  const entries = readDirEntries(dir);
  if (!entries) return;
  for (const e of entries) {
    appendDirEntry(e, dir, skip, exts, root, out, stack);
  }
}

function readDirEntries(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (isMissingFileError(err)) return null;
    throw err;
  }
}

function appendDirEntry(entry, dir, skip, exts, root, out, stack) {
  const child = path.join(dir, entry.name);
  const safeChild = resolveUnderRoot(child, root);
  if (!safeChild) return;
  if (entry.isDirectory()) {
    if (skip.has(entry.name)) return;
    stack.push(safeChild);
    return;
  }
  if (!entry.isFile()) return;
  for (const ext of exts) {
    if (entry.name.endsWith(ext)) {
      out.push(safeChild);
      break;
    }
  }
}
