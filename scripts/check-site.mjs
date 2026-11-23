import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const failures = [];
const warnings = [];
const exists = (relative) => fs.existsSync(path.resolve(root, relative));

for (const match of html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)) {
  const attrs = match[1];
  const source = match[2].trim();
  if (!source || /\\bsrc\\s*=/i.test(attrs)) continue;
  const type = (attrs.match(/\\btype=["']([^"']+)["']/i) || [])[1] || "text/javascript";
  if (!/^(text|application)\\/(javascript|ecmascript)$/i.test(type)) continue;
  try {
    new vm.Script(source, { filename: `index.html:inline-script-${html.slice(0, match.index).split("<script").length}` });
  } catch (error) {
    failures.push(`Inline JavaScript syntax: ${error.message}`);
  }
}

const localRefs = new Set();
for (const match of html.matchAll(/\\b(?:src|href)=["']([^"'#]+)["']/gi)) {
  const value = match[1].trim();
  if (!value || /^(?:[a-z]+:|\\/\\/|data:|blob:)/i.test(value)) continue;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  if (clean && /\\.[a-z0-9]{1,8}$/i.test(clean)) localRefs.add(clean.replace(/^\\.\\//, ""));
}
for (const ref of localRefs) {
  if (!exists(ref)) failures.push(`Missing local asset: ${ref}`);
}

for (const match of html.matchAll(/\\bid=["']([^"']+)["']/gi)) {
  const id = match[1];
  const count = (html.match(new RegExp(`\\\\bid=["']${id.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}["']`, "g")) || []).length;
  if (count > 1) warnings.push(`Duplicate HTML id "${id}" (${count} occurrences)`);
}

for (const file of ["study-tools.js", "chinese-library.js", "i18n.js"]) {
  if (!exists(file)) failures.push(`Required module is missing: ${file}`);
}

console.log("PhotoChinese quality checks");
console.log(`HTML size: ${Buffer.byteLength(html)} bytes`);
console.log(`Inline scripts checked: ${[...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)].filter(m => m[2].trim() && !/\\bsrc\\s*=/i.test(m[1])).length}`);
console.log(`Local assets checked: ${localRefs.size}`);
for (const warning of warnings) console.warn("WARN:", warning);
for (const failure of failures) console.error("FAIL:", failure);
if (failures.length) process.exit(1);
console.log("Static quality checks passed.");
