import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Launch gate (formerly a title-length check only).
 *
 * A project copied from the protected template may go online only when every
 * gate below passes. The raw template itself is expected to FAIL these gates —
 * that is the proof they work.
 *
 * Gates:
 *  A. Domain: no `example.com` fallback left in src/config/site.ts; when
 *     indexing is enabled, a real HTTPS NEXT_PUBLIC_SITE_URL must exist.
 *  B. Version: VERSION file matches TEMPLATE_VERSION in src/config/site.ts.
 *  C. Placeholders: no `{{...}}` in content/locales, no `example.com` in content.
 *  D. Content: at least one MDX article; every article has a metadata.title
 *     that fits the 60-character rendered-title budget (original check).
 *  E. Navigation: NAVIGATION_CONFIG declares at least one entry.
 *  F. Indexing: NEXT_PUBLIC_INDEXABLE=true is only allowed when A–E pass.
 */

const root = process.cwd();
const contentRoot = path.join(root, "content");
const localesRoot = path.join(root, "src", "locales");
const maxTitleLength = 60;

const failures = [];
const warnings = [];
const notes = [];

async function walk(directory, extension) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return (await Promise.all(entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(target, extension);
      return entry.isFile() && entry.name.endsWith(extension) ? [target] : [];
    }))).flat();
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function readEnvFiles() {
  const values = {};
  for (const name of [".env", ".env.local", ".env.production", ".env.production.local"]) {
    try {
      const raw = await fs.readFile(path.join(root, name), "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && !line.trimStart().startsWith("#")) values[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    } catch { /* file absent */ }
  }
  return values;
}

function readMetadataTitle(source) {
  const metadata = source.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\n\}/);
  const title = metadata?.[1].match(/\btitle\s*:\s*["']([^"']+)["']/);
  return title?.[1];
}

async function siteNameFor(locale) {
  const localeFile = path.join(localesRoot, `${locale}.json`);
  const fallbackFile = path.join(localesRoot, "en.json");
  const raw = await fs.readFile(localeFile).catch(() => fs.readFile(fallbackFile));
  return JSON.parse(raw).site.wikiName;
}

const env = { ...(await readEnvFiles()) };
for (const key of ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_INDEXABLE"]) {
  if (process.env[key]) env[key] = process.env[key];
}
const indexable = env.NEXT_PUBLIC_INDEXABLE === "true";

// --- Gate A: domain -------------------------------------------------------
const siteConfig = await fs.readFile(path.join(root, "src", "config", "site.ts"), "utf8");
if (/example\.com/i.test(siteConfig)) {
  failures.push("domain: src/config/site.ts still contains the example.com template fallback — set the real domain before launch");
}
if (indexable) {
  const url = env.NEXT_PUBLIC_SITE_URL || "";
  if (!/^https:\/\//.test(url) || /example\.com|localhost|127\.0\.0\.1/.test(url)) {
    failures.push(`domain: indexing is enabled but NEXT_PUBLIC_SITE_URL is not a real HTTPS origin (got "${url || "unset"}")`);
  }
}

// --- Gate B: template version ---------------------------------------------
let versionFile = null;
try { versionFile = (await fs.readFile(path.join(root, "VERSION"), "utf8")).trim(); } catch { /* legacy copy */ }
const versionMatch = siteConfig.match(/TEMPLATE_VERSION\s*=\s*["']([^"']+)["']/);
if (versionFile === null) {
  warnings.push("version: no VERSION file — this project predates template v2 (legacy v1); version tracking starts with the next template sync");
} else if (!versionMatch) {
  failures.push("version: src/config/site.ts does not export TEMPLATE_VERSION while a VERSION file exists");
} else if (versionMatch[1] !== versionFile) {
  failures.push(`version: VERSION file says "${versionFile}" but TEMPLATE_VERSION says "${versionMatch[1]}"`);
} else {
  notes.push(`version: template v${versionFile}`);
}

// --- Gate C: placeholders ---------------------------------------------------
const mdxFiles = await walk(contentRoot, ".mdx");
const localeFiles = await walk(localesRoot, ".json");
for (const file of mdxFiles) {
  const relative = path.relative(root, file);
  const source = await fs.readFile(file, "utf8");
  if (/\{\{[^}]+\}\}/.test(source)) failures.push(`placeholder: ${relative} still contains a {{...}} placeholder`);
  if (/example\.com/i.test(source)) failures.push(`placeholder: ${relative} still references example.com`);
}
for (const file of localeFiles) {
  const relative = path.relative(root, file);
  if (/\{\{[^}]+\}\}/.test(await fs.readFile(file, "utf8"))) failures.push(`placeholder: ${relative} still contains a {{...}} placeholder`);
}

// --- Gate D: content --------------------------------------------------------
if (mdxFiles.length === 0) {
  failures.push("content: no MDX articles found under content/ — an empty site must not launch");
}
for (const file of mdxFiles) {
  const relative = path.relative(contentRoot, file);
  const [locale = "en"] = relative.split(path.sep);
  const title = readMetadataTitle(await fs.readFile(file, "utf8"));
  if (!title) {
    failures.push(`content: ${relative}: missing metadata.title`);
    continue;
  }
  const siteName = await siteNameFor(locale);
  const renderedTitle = `${title} — ${siteName}`.length <= maxTitleLength ? `${title} — ${siteName}` : title;
  if (renderedTitle.length > maxTitleLength) failures.push(`content: ${relative}: rendered title is ${renderedTitle.length} characters`);
}

// --- Gate E: navigation -----------------------------------------------------
const navigationConfig = await fs.readFile(path.join(root, "src", "config", "navigation.ts"), "utf8");
const navBody = navigationConfig.match(/NAVIGATION_CONFIG[^=]*=\s*\[([\s\S]*?)\];/);
if (!navBody || !/\bkey\s*:/.test(navBody[1])) {
  failures.push("navigation: NAVIGATION_CONFIG is empty — the site would launch without navigation or content types");
}

// --- Gate F: indexing state -------------------------------------------------
if (indexable && failures.length > 0) {
  failures.push("indexing: NEXT_PUBLIC_INDEXABLE=true while launch gates are failing — robots.txt would invite crawling of an unready site");
}
notes.push(indexable
  ? "indexing: NEXT_PUBLIC_INDEXABLE=true (robots.txt allows crawling)"
  : "indexing: disabled — robots.txt responds Disallow: / until NEXT_PUBLIC_INDEXABLE=true");

// --- Report -------------------------------------------------------------------
for (const note of notes) console.log(`info: ${note}`);
for (const warning of warnings) console.log(`warn: ${warning}`);
if (failures.length > 0) {
  console.error("Launch gate failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Launch gate passed.");
