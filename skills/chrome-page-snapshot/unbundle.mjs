#!/usr/bin/env node
/**
 * Turn a bundle from bundle-images.js into local files and point the HTML at them.
 *
 *   node unbundle.mjs <page.html> <page.images.json>
 *
 * Writes <page>_files/<name> for each image and <page>.local.html with every
 * bundled URL replaced by its relative local path. The original HTML is untouched.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const [htmlPath, bundlePath] = process.argv.slice(2);
if (!htmlPath || !bundlePath) {
  console.error('Usage: node unbundle.mjs <page.html> <page.images.json>');
  process.exit(2);
}
const stem = htmlPath.replace(/\.[^./]*$/, '');
const filesDir = `${basename(stem)}_files`;
const outDir = join(dirname(htmlPath), filesDir);
mkdirSync(outDir, { recursive: true });

const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
const html = readFileSync(htmlPath, 'utf8');
const used = new Set();
const localPaths = new Map();
for (const [url, { b64 }] of Object.entries(bundle)) {
  let name = basename(new URL(url).pathname) || 'image';
  for (let n = 2; used.has(name); n++) name = name.replace(/(\.[^.]*)?$/, `-${n}$1`);
  used.add(name);
  const target = join(outDir, name);
  if (existsSync(target)) throw new Error(`refusing to overwrite ${target}`);
  writeFileSync(target, Buffer.from(b64, 'base64'));
  localPaths.set(url, `${filesDir}/${name}`);
}
let refs = 0;
let localHtml = html;
if (localPaths.size) {
  const urls = [...localPaths.keys()].sort((a, b) => b.length - a.length)
    .map(url => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const reference = new RegExp(`(^|[\\s"'(>,]|&quot;|&#39;)(${urls.join('|')})(?=$|[\\s"'<)]|&quot;|&#39;|,\\s)`, 'g');
  localHtml = html.replace(reference, (_, prefix, url) => {
    refs++;
    return prefix + localPaths.get(url);
  });
}
const outHtml = `${stem}.local.html`;
writeFileSync(outHtml, localHtml, { flag: 'wx' });
console.log(`files: ${used.size} -> ${outDir}\nrefs replaced: ${refs}\nwrote ${outHtml}`);
