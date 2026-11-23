import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const failures = [];
const warnings = [];
const exists = (relative) => fs.existsSync(path.resolve(root, relative));
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((match) => match[2].trim() && !/\bsrc\s*=/i.test(match[1]));

for (let index = 0; index < inlineScripts.length; index += 1) {
  const match = inlineScripts[index];
  const type = (match[1].match(/\btype=["']([^"']+)["']/i) || [])[1] || "text/javascript";
  if (!/^(text|application)\/(javascript|ecmascript)$/i.test(type)) continue;
  try {
    new vm.Script(match[2], { filename: "index.html:inline-script-" + (index + 1) });
  } catch (error) {
    failures.push("Inline JavaScript syntax: " + error.message);
  }
}

const localRefs = new Set();
for (const match of html.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/gi)) {
  const value = match[1].trim();
  if (!value || /^(?:[a-z]+:|\/\/|data:|blob:)/i.test(value)) continue;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  if (clean && /\.[a-z0-9]{1,8}$/i.test(clean)) localRefs.add(clean.replace(/^\.\//, ""));
}
for (const ref of localRefs) {
  if (!exists(ref)) failures.push("Missing local asset: " + ref);
}

const idCounts = new Map();
for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
  idCounts.set(match[1], (idCounts.get(match[1]) || 0) + 1);
}
for (const [id, count] of idCounts) {
  if (count > 1) warnings.push('Duplicate HTML id "' + id + '" (' + count + " occurrences)");
}

for (const file of ["study-tools.js", "chinese-library.js", "i18n.js"]) {
  if (!exists(file)) failures.push("Required module is missing: " + file);
}

console.log("PhotoChinese quality checks");
console.log("HTML size: " + Buffer.byteLength(html) + " bytes");
console.log("Inline scripts checked: " + inlineScripts.length);
console.log("Local assets checked: " + localRefs.size);
for (const warning of warnings) console.warn("WARN:", warning);
for (const failure of failures) console.error("FAIL:", failure);
if (failures.length) process.exit(1);
console.log("Static quality checks passed.");
