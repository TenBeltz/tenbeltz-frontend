// Rebuild the explicitly fictional PDF preview using the same browser renderer.
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
const root = resolve(import.meta.dirname, '../..');
const work = await mkdtemp(tmpdir() + '/tenbeltz-diagnosis-pdf-');
try {
  await build({ entryPoints: [root + '/src/lib/diagnosis-report.ts'], bundle: true, platform: 'node', format: 'esm', outfile: work + '/report.mjs', logLevel: 'silent' });
  const { buildDiagnosisReport } = await import(pathToFileURL(work + '/report.mjs').href);
  const fixture = JSON.parse(await readFile(root + '/tools/brand-kit/diagnosis-sample.json', 'utf8'));
  globalThis.fetch = async path => {
    if (typeof path !== 'string' || !path.startsWith('/brand/diagnosis/') || path.includes('..')) throw new Error('Unexpected resource');
    return new Response(await readFile(root + '/public' + path));
  };
  const doc = await buildDiagnosisReport(fixture.lead, fixture.answers, fixture.lang);
  await writeFile(root + '/public/brand/diagnosis/tenbeltz-diagnostico-ejemplo.pdf', Buffer.from(doc.output('arraybuffer')));
  console.log(`Fictional sample generated: ${doc.getNumberOfPages()} pages.`);
} finally { await rm(work, { recursive: true, force: true }); }
