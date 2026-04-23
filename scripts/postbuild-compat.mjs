import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const astroDir = path.resolve('dist/client/_astro');
const directoryEntries = await readdir(astroDir).catch(() => []);

if (directoryEntries.length === 0) {
  console.warn('[postbuild-compat] No Astro assets found, skipping compatibility aliases.');
  process.exit(0);
}

const readAsset = async (file) => readFile(path.join(astroDir, file), 'utf8');
const scrollRevealFiles = directoryEntries.filter((file) => file.startsWith('ScrollReveal.') && file.endsWith('.js'));

let scrollRevealImplementation;
let scrollRevealReexport;

for (const file of scrollRevealFiles) {
  const contents = await readAsset(file);
  if (contents.includes('export{g as ScrollReveal}') || contents.includes('export {g as ScrollReveal}')) {
    scrollRevealImplementation = file;
  }

  if (
    contents.includes('from"./ScrollReveal.') &&
    (contents.includes('export{m as ScrollReveal}') || contents.includes('export {m as ScrollReveal}'))
  ) {
    scrollRevealReexport = file;
  }
}

const aliasCopies = [
  {
    legacy: 'clientes.2Eg4H2qD.css',
    findCurrent: (files) => files.find((file) => file.startsWith('clientes.') && file.endsWith('.css')),
  },
  {
    legacy: 'ContactForm.DBQQQBYL.js',
    findCurrent: (files) => files.find((file) => file.startsWith('ContactForm.') && file.endsWith('.js')),
  },
  {
    legacy: 'ScrollReveal.Cw0ZV1ZQ.js',
    findCurrent: () => scrollRevealImplementation,
  },
  {
    legacy: 'ScrollReveal.TdTbJmr-.js',
    findCurrent: () => scrollRevealReexport,
  },
];

const legacyModules = [
  {
    legacy: 'NewsletterForm.2pM7kzmN.js',
    contents: 'export default function NewsletterForm() { return null; }\n',
  },
];

await mkdir(astroDir, { recursive: true });

for (const { legacy, findCurrent } of aliasCopies) {
  const current = findCurrent(directoryEntries);
  if (!current) {
    console.warn(`[postbuild-compat] No source asset found for ${legacy}, skipping.`);
    continue;
  }

  const source = path.join(astroDir, current);
  const target = path.join(astroDir, legacy);
  if (source !== target) {
    await copyFile(source, target);
  }
}

for (const { legacy, contents } of legacyModules) {
  await writeFile(path.join(astroDir, legacy), contents, 'utf8');
}

console.log('[postbuild-compat] Compatibility aliases generated.');
