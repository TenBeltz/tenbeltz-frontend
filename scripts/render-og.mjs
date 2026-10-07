// Render the editorial social previews with an installed Playwright module.
// TENBELTZ_PLAYWRIGHT_MODULE can point to an existing Playwright index.mjs.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(process.env.TENBELTZ_PLAYWRIGHT_MODULE || 'playwright');
const font = (await readFile(path.join(root, 'public/fonts/ibm-plex-sans-latin.woff2'))).toString('base64');
const mark = (await readFile(path.join(root, 'public/images/tenbeltz-mark.svg'))).toString('base64');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const lang of ['es', 'en']) {
    const en = lang === 'en';
    await page.setContent(`<!doctype html><html lang="${lang}"><head><style>
      @font-face{font-family:Plex;src:url(data:font/woff2;base64,${font});font-weight:100 900}
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;padding:55px 65px;background:#f7f6f2;color:#252826;font-family:Plex,sans-serif;display:flex;flex-direction:column}
      header{display:flex;align-items:center;gap:12px;font-size:30px;font-weight:600;letter-spacing:-1.5px}header img{width:30px;height:33px}header span{margin-left:auto;font-size:14px;font-weight:400;letter-spacing:0;color:#676b65}
      main{flex:1;display:flex;flex-direction:column;justify-content:center}small{font-size:12px;letter-spacing:2px;color:#676b65;text-transform:uppercase;margin-bottom:24px}h1{font-size:76px;line-height:1.05;letter-spacing:-3.5px;font-weight:500;margin:0;max-width:1000px}em{font-style:normal;color:#583346}
      footer{border-top:1px solid #d9dcd4;padding-top:22px;font-size:16px;color:#676b65;display:flex;justify-content:space-between}
    </style></head><body><header><img src="data:image/svg+xml;base64,${mark}" alt="">TenBeltz.<span>tenbeltz.com</span></header><main><small>${en ? 'Applied engineering' : 'Ingeniería aplicada'}</small><h1>${en ? 'AI engineering<br>for <em>software companies.</em>' : 'Ingeniería de IA<br>para <em>empresas de software.</em>'}</h1></main><footer><span>${en ? 'Technical judgment. Integration. Delivery.' : 'Criterio técnico. Integración. Entrega.'}</span><span>Bizkaia ↗</span></footer></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(root, `public/og/og-${lang}.png`) });
  }
} finally { await browser.close(); }
