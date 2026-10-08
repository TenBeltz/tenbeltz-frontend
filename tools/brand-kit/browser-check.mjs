// Optional QA. Install Playwright separately or point BRAND_PLAYWRIGHT_MODULE
// to an existing package. No authenticated browser profile or external requests.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.BRAND_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const kit = path.join(root, 'brand');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [], results = [];
try {
  const context = await browser.newContext();
  await context.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith('file:') || url.startsWith('data:') ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(pathToFileURL(path.join(kit, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    results.push(await page.evaluate(width => ({ width, overflow: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src) }), width));
    const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(a => a.href));
    const missingAnchors=await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
    if(missingAnchors.length) throw Error(`Missing gallery sections: ${missingAnchors.join(', ')}`);
    for (const link of links) {
      const u = new URL(link);
      if (u.protocol === 'file:') await fs.access(fileURLToPath(u));
    }
    if (width === 1440) await page.screenshot({ path: path.join(kit, 'gallery-desktop.png') });
    if (width === 390) await page.screenshot({ path: path.join(kit, 'gallery-mobile.png') });
  }
  for (const name of ['es', 'en', 'template']) {
    await page.goto(pathToFileURL(path.join(kit, 'dist/presentations', `tenbeltz-${name}.html`)).href);
    const before = await page.locator('#counter').textContent();
    await page.keyboard.press('ArrowRight');
    const after = await page.locator('#counter').textContent();
    if (!before.startsWith('1 /') || !after.startsWith('2 /')) throw Error(`Navigation failed: ${name}`);
    await page.keyboard.press('ArrowLeft');
    if (await page.locator('#counter').textContent() !== before) throw Error(`Back navigation failed: ${name}`);
  }
  for (const name of ['proposal', 'report']) {
    await page.goto(pathToFileURL(path.join(kit, 'dist/documents', `tenbeltz-${name}-template.html`)).href);
    await page.setViewportSize({ width: 900, height: 1200 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(kit, `${name}-preview.png`), fullPage: true });
    await page.goto(pathToFileURL(path.join(kit, 'dist/documents', `tenbeltz-${name}-example.html`)).href);
    for (const width of [1440,390,320]) {
      await page.setViewportSize({ width, height: 1000 });
      const status=await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth>innerWidth,
        brokenImages: [...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src) }));
      if(status.overflow||status.brokenImages.length) throw Error(`${name} example ${width}: ${JSON.stringify(status)}`);
    }
  }
  if (errors.length || results.some(r => r.overflow || r.brokenImages.length)) throw Error(JSON.stringify({ errors, results }));
  await fs.writeFile(path.join(kit, 'browser-verification.json'), JSON.stringify({ results, errors, presentations: 3, checkedLocalLinks: true }, null, 2));
  console.log(JSON.stringify({ results, errors, presentations: 3, checkedLocalLinks: true }, null, 2));
} finally {
  await browser.close();
}
