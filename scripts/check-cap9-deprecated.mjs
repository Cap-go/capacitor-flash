#!/usr/bin/env node
/**
 * Capacitor 9 deprecated native API guard.
 *
 * Fails when plugin native sources still use APIs removed in Capacitor 9.
 * Does not flag Cordova SwiftPM product dependencies (still required on Cap 8).
 *
 * Usage (run from plugin repository root):
 *   node scripts/check-cap9-deprecated.mjs
 */

import path from "node:path";
import { loadCapacitorPluginPackage } from "./lib/load-plugin-package.mjs";
import {
  createPluginFs,
  DEFAULT_SKIP_DIR_NAMES,
  resolveCwdPluginDir,
} from "./lib/plugin-check-fs.mjs";

const SKIP_DIRS = [...DEFAULT_SKIP_DIR_NAMES, "example-app"];

/** @type {{ id: string, pattern: RegExp, exts: string[], ignoreLine?: RegExp }[]} */
const RULES = [
  {
    id: "hasOption",
    pattern: /\bhasOption\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "getConfigValue",
    pattern: /\bgetConfigValue\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "@NativePlugin",
    pattern: /@NativePlugin\b/,
    exts: [".java", ".kt"],
  },
  {
    id: "saveCall",
    pattern: /\bsaveCall\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "getSavedCall",
    pattern: /\bgetSavedCall\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "freeSavedCall",
    pattern: /\bfreeSavedCall\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "releaseCall",
    pattern: /\breleaseCall\s*\(/,
    exts: [".java", ".kt", ".swift"],
  },
  {
    id: "pluginRequestPermission",
    pattern: /\bpluginRequestPermissions?\s*\(/,
    exts: [".java", ".kt"],
  },
  {
    id: "pluginRequestAllPermissions",
    pattern: /\bpluginRequestAllPermissions\s*\(/,
    exts: [".java", ".kt"],
  },
  {
    id: "hasDefinedPermissions",
    pattern: /\bhasDefinedPermissions\s*\(/,
    exts: [".java", ".kt"],
  },
  {
    id: "CAPBridge",
    pattern: /\bCAPBridge\./,
    exts: [".swift"],
    ignoreLine: /CAPBridgedPlugin/,
  },
  {
    id: "CAPNotifications",
    pattern: /\bCAPNotifications\b/,
    exts: [".swift"],
  },
];

const CORDova_SPM_LINE =
  /\.product\s*\(\s*name\s*:\s*"Cordova"\s*,\s*package\s*:\s*"capacitor-swift-pm"\s*\)/;

function collectScanRoots(pluginDir, cap, fsApi) {
  const roots = [];
  if (cap.android) {
    const androidMain = path.join(pluginDir, "android", "src", "main");
    if (fsApi.exists(androidMain)) roots.push(androidMain);
  }
  if (cap.ios) {
    const iosSources = path.join(pluginDir, "ios", "Sources");
    if (fsApi.exists(iosSources)) roots.push(iosSources);
    else {
      const iosDir = path.join(pluginDir, "ios");
      if (fsApi.exists(iosDir)) roots.push(iosDir);
    }
  }
  const packageSwift = path.join(pluginDir, "Package.swift");
  if (fsApi.exists(packageSwift)) roots.push(packageSwift);
  return roots;
}

function codePortionForScan(line) {
  let portion = line;
  const slashComment = portion.indexOf("//");
  if (slashComment >= 0) portion = portion.slice(0, slashComment);
  portion = portion.replace(/"(?:\\.|[^"\\])*"/g, "");
  portion = portion.replace(/'(?:\\.|[^'\\])*'/g, "");
  portion = portion.replace(/`(?:\\.|[^`\\])*`/g, "");
  return portion;
}

function isCommentOnlyLine(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*/")
  );
}

function scanFile(filePath, rule, readText) {
  const ext = path.extname(filePath);
  if (!rule.exts.includes(ext)) return [];

  const txt = readText(filePath);
  const lines = txt.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (filePath.endsWith("Package.swift") && CORDova_SPM_LINE.test(line)) {
      continue;
    }
    if (isCommentOnlyLine(line)) continue;
    if (rule.ignoreLine?.test(line)) continue;
    const code = codePortionForScan(line);
    if (rule.pattern.test(code)) {
      hits.push({ line: i + 1, text: line.trim() });
    }
  }
  return hits;
}

const fsApi = createPluginFs(resolveCwdPluginDir());
const { cap } = loadCapacitorPluginPackage(fsApi, "cap9-deprecated");
const pluginDir = fsApi.root;

if (!cap.android && !cap.ios) {
  process.exit(0);
}

const scanRoots = collectScanRoots(pluginDir, cap, fsApi);
const allExts = [...new Set(RULES.flatMap((r) => r.exts))];
const files = [];
for (const root of scanRoots) {
  if (root.endsWith("Package.swift")) {
    files.push(root);
    continue;
  }
  files.push(...fsApi.walkFiles(root, allExts, SKIP_DIRS));
}

const violations = [];
for (const file of files) {
  for (const rule of RULES) {
    const hits = scanFile(file, rule, fsApi.readText.bind(fsApi));
    for (const hit of hits) {
      violations.push({
        rule: rule.id,
        file: path.relative(pluginDir, file),
        line: hit.line,
        text: hit.text,
      });
    }
  }
}

if (violations.length) {
  const relDir = path.relative(process.cwd(), pluginDir) || ".";
  console.error(`[cap9-deprecated] FAIL in ${relDir}`);
  for (const v of violations) {
    console.error(`- ${v.rule}: ${v.file}:${v.line}: ${v.text}`);
  }
  process.exit(1);
}

process.exit(0);
