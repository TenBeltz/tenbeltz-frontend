// Process-orientation routing and branded PDF regression checks. No HTTP or email.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = resolve(import.meta.dirname, '../..');
const output = resolve(process.argv[2] || root + '/tmp/business-diagnosis');
const temporary = await mkdtemp(tmpdir() + '/tenbeltz-business-diagnosis-');
try {
  await mkdir(output, { recursive: true });
  await build({ entryPoints: [root + '/src/lib/diagnosis.ts'], bundle: true, platform: 'node', format: 'esm', outfile: temporary + '/model.mjs', logLevel: 'silent' });
  const { questions, evaluate, diagnosisMessage } = await import(pathToFileURL(temporary + '/model.mjs').href);
  const unknown = ['unknown', '', 'unknown', 'unknown', '', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'];
  const implementation = ['documents', 'We extract information from incoming files.', 'daily', 'over-ten', 'Email and spreadsheets', 'scattered', 'yes', 'lead', 'errors', 'implementation'];
  const training = ['training', '', 'weekly', 'two-ten', '', 'systems', 'unknown', 'team', 'learning', 'training'];
  assert.equal(questions.length, 10);
  assert.equal(evaluate(unknown).nextStep, 'diagnosis');
  assert.equal(evaluate(implementation).nextStep, 'implementation');
  assert.equal(evaluate(training).nextStep, 'training');
  const missingOwner = [...implementation]; missingOwner[7] = 'unknown';
  assert.equal(evaluate(missingOwner).nextStep, 'diagnosis');
  const needsTraining = [...implementation]; needsTraining[8] = 'learning';
  assert.equal(evaluate(needsTraining).nextStep, 'training');
  assert.throws(() => evaluate([]));
  assert.throws(() => evaluate(Array(10).fill('unrecognised')));
  const tooLong = [...implementation]; tooLong[1] = 'a'.repeat(401);
  assert.throws(() => evaluate(tooLong));
  assert(!Object.hasOwn(evaluate(implementation), 'score'));
  assert(diagnosisMessage(implementation, 'en').length < 6000);
  assert(evaluate(unknown).clarify.length > 0);

  await build({ entryPoints: [root + '/src/lib/diagnosis-report.ts'], bundle: true, platform: 'node', format: 'esm', outfile: temporary + '/report.mjs', logLevel: 'silent' });
  const { buildDiagnosisReport } = await import(pathToFileURL(temporary + '/report.mjs').href);
  let failResource = true;
  let resourceRequests = 0;
  globalThis.fetch = async path => {
    assert(typeof path === 'string' && path.startsWith('/brand/diagnosis/') && !path.includes('..'), 'Only local brand assets may be fetched');
    resourceRequests++;
    if (failResource) return new Response('', { status: 503 });
    return new Response(await readFile(root + '/public' + path));
  };
  const lead = { name: 'QA ficticio', company: 'Empresa ficticia de pruebas', email: 'qa@example.invalid' };
  await assert.rejects(buildDiagnosisReport(lead, unknown, 'es'));
  failResource = false;
  const maxAnswers = [...implementation];
  maxAnswers[1] = 'Á'.repeat(400); maxAnswers[4] = 'Herramienta '.repeat(21).slice(0, 240);
  const maxLead = { name: 'Á'.repeat(120), company: 'E'.repeat(160), email: 'a'.repeat(240) + '@example.test' };
  const newlineAnswers = [...implementation]; newlineAnswers[1] = ('\n\nTarea ').repeat(45).slice(0, 400);
  const fixtures = [
    { name: 'unknown-es', answers: unknown, lang: 'es', lead },
    { name: 'implementation-en', answers: implementation, lang: 'en', lead },
    { name: 'training-es', answers: training, lang: 'es', lead },
    { name: 'maximum-fields-en', answers: maxAnswers, lang: 'en', lead: maxLead },
    { name: 'line-breaks-es', answers: newlineAnswers, lang: 'es', lead },
  ];
  const reports = [];
  for (const fixture of fixtures) {
    const doc = await buildDiagnosisReport(fixture.lead, fixture.answers, fixture.lang);
    assert(doc.getNumberOfPages() >= 6);
    const bytes = Buffer.from(doc.output('arraybuffer'));
    assert.equal(bytes.subarray(0, 4).toString(), '%PDF');
    await writeFile(output + '/' + fixture.name + '.pdf', bytes);
    reports.push({ name: fixture.name, pages: doc.getNumberOfPages(), bytes: bytes.length });
  }
  await writeFile(output + '/results.json', JSON.stringify({ routingChecks: 12, reports, resourceRequests, realEmails: 0 }, null, 2) + '\n');
  console.log(JSON.stringify({ routingChecks: 12, reports, realEmails: 0, output }, null, 2));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
