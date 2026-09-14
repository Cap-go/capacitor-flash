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

export function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    if (isMissingFileError(err)) return "";
    throw err;
  }
}

export function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    if (isMissingFileError(err)) return false;
    throw err;
  }
}

function isMissingFileError(err) {
  return (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err.code === "ENOENT" || err.code === "ENOTDIR")
  );
}

export function walkFiles(rootDir, exts, skipDirNames = DEFAULT_SKIP_DIR_NAMES) {
  const skip = new Set(skipDirNames);
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      if (isMissingFileError(err)) continue;
      throw err;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (skip.has(e.name)) continue;
        stack.push(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      for (const ext of exts) {
        if (e.name.endsWith(ext)) {
          out.push(path.join(dir, e.name));
          break;
        }
      }
    }
  }
  out.sort();
  return out;
}
