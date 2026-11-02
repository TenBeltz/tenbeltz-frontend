// End-to-end regression for the business website. Contact requests are intercepted.
// PLAYWRIGHT_PACKAGE can point at an isolated install; no package dependency is added.
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = (process.env.QA_BASE || 'http://127.0.0.1:10022').replace(/\/$/, '');
const out = process.env.QA_OUTPUT || path.resolve('tmp/business-qa/results');
const mode = process.env.QA_MODE || 'all';
const routes = ['/', '/en', '/services', '/en/services', '/ia-para-empresas', '/en/ai-for-business', '/documentos-e-informes', '/en/documents-and-reports', '/automatizacion-administrativa', '/en/administrative-automation', '/agentes-voz-saas', '/en/voice-agents-for-saas', '/ia-privada-productos', '/en/private-ai-products', '/casos', '/en/case-studies', '/quien-esta-detras', '/en/who-is-behind', '/diagnostico-ia', '/en/ai-diagnosis', '/aritz', '/en/aritz', '/politicas', '/en/politicas', '/ia-para-software', '/en/ai-for-software', '/evaluacion-ia-saas', '/en/ai-evaluation-for-saas'];
let browser, page;
const report = {base, layouts: [], interactions: [], pageErrors: [], mockedContacts: [], realEmails: 0};
async function context(options = {}) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', ...options });
  await ctx.route('**/*', route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname === '/api/contact') {
      report.mockedContacts.push(JSON.parse(request.postData() || '{}'));
      return route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'});
    }
    if (url.origin === new URL(base).origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
    return route.abort();
  });
  return ctx;
}
async function open(ctx, route, width) {
  const p = await ctx.newPage();
  p.on('pageerror', e => report.pageErrors.push({route, error:e.message}));
  if (width) await p.setViewportSize({width,height:900});
  const response = await p.goto(base + route, {waitUntil:'networkidle',timeout:30000});
  assert.equal(response.status(),200,route);
  await p.evaluate(() => document.fonts.ready);
  return p;
}
async function finishDiagnosis(p, overrides = {}, text = true) {
  for (let i=0;i<10;i++) {
    const form = p.locator('form[data-diagnosis-step]');
    const id = await form.getAttribute('data-diagnosis-step');
    const textarea = form.locator('textarea');
    if (await textarea.count()) {
      if (text) await textarea.fill(id === 'process' ? 'Recibimos documentos y preparamos informes para revisar.' : 'Correo y hojas de cálculo');
    } else {
      const choice = overrides[id];
      if (choice) await form.locator(`input[type=radio][value="${choice}"]`).check();
      else await form.locator('input[type=radio]').first().check();
    }
    await form.locator('button[type=submit]').click();
  }
  await p.locator('[data-diagnosis-result]').waitFor();
}
async function download(p, filename) {
  const event = p.waitForEvent('download');
  await p.locator('.diagnosis-lead button[type=submit]').click();
  const file = await event;
  await file.saveAs(path.join(out,filename));
  assert((await fs.stat(path.join(out,filename))).size>100000, 'branded PDF should include assets');
}
(async()=>{
  await fs.mkdir(out,{recursive:true});
  browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  if(mode!=='interactions') {
    for(const width of [1440,390,320]) {
      const ctx=await context({viewport:{width,height:900}});
      for(const route of routes) {
        page=await open(ctx,route);
        const result=await page.evaluate(()=>({
          overflow:document.documentElement.scrollWidth>innerWidth,
          h1:document.querySelectorAll('h1').length,
          main:!!document.querySelector('#main-content'),
          heading:document.querySelector('h1')?.textContent?.trim(),
          brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),
          navOverflow:document.querySelector('.header-inner').scrollWidth>document.querySelector('.header-inner').clientWidth,
          nav:[...document.querySelectorAll('.nav-page-link')].map(a=>a.textContent.trim())
        }));
        report.layouts.push({width,route,...result});
        assert.equal(result.h1,1,`${width} ${route}: one H1`);
        assert(result.main&&result.heading,`${route}: visible structure`);
        assert.equal(result.overflow,false,`${width} ${route}: overflow`);
        assert.equal(result.navOverflow,false,`${width} ${route}: nav overflow`);
        assert.deepEqual(result.brokenImages,[],`${route}: images`);
        assert(!result.nav.some(label=>/software/i.test(label)),`${route}: audience split removed`);
        if([1440,390].includes(width)&&['/','/ia-para-empresas','/services','/diagnostico-ia'].includes(route)) {
          if(await page.locator('#cookie-decline').isVisible())await page.locator('#cookie-decline').click();
          await page.screenshot({path:path.join(out,`${width}-${route.replaceAll('/','-')||'home'}.png`),fullPage:true});
        }
        await page.close();
      }
      await ctx.close();
      await fs.writeFile(path.join(out,'layout.json'),JSON.stringify(report,null,2));
      console.log(`Layout: ${routes.length} routes at ${width}px passed.`);
    }
    const tablet=await context();
    for(const width of [741,768,1024]) {
      page=await open(tablet,'/',width);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'tablet body');
      assert(await page.locator('.header-inner').evaluate(e=>e.scrollWidth<=e.clientWidth),`tablet nav ${width}`);
      await page.close();
    }
    await tablet.close();
    report.interactions.push('Tablet header at 741/768/1024px');
  }
  if(mode!=='layout') {
    const ctx=await context({viewport:{width:390,height:844}});
    page=await open(ctx,'/');
    if(await page.locator('#cookie-decline').isVisible())await page.locator('#cookie-decline').click();
    const toggle=page.locator('[data-menu-toggle]');
    await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert(await page.locator('main').evaluate(e=>e.inert));
    await page.locator('.language-link').focus();await page.keyboard.press('Tab');
    assert(await page.locator('.site-header .brand').evaluate(e=>e===document.activeElement));
    await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    assert(!await page.locator('main').evaluate(e=>e.inert));
    await toggle.click();await page.locator('.nav-contact').click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(new URL(page.url()).hash,'#contact-section');
    report.interactions.push('Mobile menu, focus cycle, Escape and contact anchor');
    const faq=page.locator('.business-faq details').first();
    await faq.locator('summary').click();assert(await faq.evaluate(e=>e.open));
    await faq.locator('summary').press('Enter');assert(!await faq.evaluate(e=>e.open));
    report.interactions.push('Native FAQ click and keyboard');
    await page.locator('#name').fill('QA ficticio');await page.locator('#email').fill('qa@example.invalid');
    await page.locator('#company').fill('QA TenBeltz');await page.locator('#interest').selectOption('training');
    await page.locator('#message').fill('Consulta ficticia interceptada en el navegador.');
    await page.locator('.contact-form button[type=submit]').click();
    await page.waitForFunction(()=>document.querySelector('.contact-form #message').value==='');
    assert(report.mockedContacts.at(-1).message.includes('Formación para el equipo'));
    await page.route('**/api/contact',r=>r.fulfill({status:500,contentType:'application/json',body:'{}'}));
    await page.locator('#name').fill('QA ficticio');await page.locator('#email').fill('qa@example.invalid');
    await page.locator('#message').fill('Conservar tras un fallo.');
    await page.locator('.contact-form button[type=submit]').click();
    await page.waitForFunction(()=>!document.querySelector('.contact-form button[type=submit]').disabled);
    assert.equal(await page.locator('#message').inputValue(),'Conservar tras un fallo.');
    await page.unroute('**/api/contact');
    report.interactions.push('Contact success, human-readable interest, failure preserves input');
    await page.goto(base+'/documentos-e-informes',{waitUntil:'networkidle'});
    await page.locator('[data-menu-toggle]').click();
    await page.locator('.language-link').click();
    await page.waitForURL('**/en/documents-and-reports');
    assert((await page.locator('h1').textContent()).includes('documents'));
    report.interactions.push('Translated solution URL and content');
    await page.goto(base+'/casos',{waitUntil:'networkidle'});
    const technical=page.locator('#clasificacion-documental details');
    await technical.locator('summary').click();assert(await technical.evaluate(e=>e.open));
    assert((await technical.textContent()).includes('91,51'));
    report.interactions.push('Case technical evidence remains available');
    const before=report.mockedContacts.length;
    await page.goto(base+'/diagnostico-ia',{waitUntil:'networkidle'});
    await finishDiagnosis(page,{area:'unknown',stage:'exploring'},false);
    assert.equal(await page.locator('[data-diagnosis-result]').getAttribute('data-diagnosis-result'),'diagnosis');
    assert.equal(await page.locator('.diagnosis-score').count(),0);
    assert.equal(report.mockedContacts.length,before,'no contact before consent');
    await page.screenshot({path:path.join(out,'diagnosis-summary-mobile.png'),fullPage:true});
    await page.locator('#diagnosis-name').fill('QA ficticio');await page.locator('#diagnosis-company').fill('QA empresa');await page.locator('#diagnosis-email').fill('qa@example.invalid');
    await page.locator('.diagnosis-lead button[type=submit]').click();
    assert.equal(report.mockedContacts.length,before,'consent required');
    await page.locator('input[name=permission]').check();
    await download(page,'orientation-es.pdf');
    assert.equal(report.mockedContacts.length,before+1);
    assert.equal(report.mockedContacts.at(-1).kind,'diagnosis');
    assert(!report.mockedContacts.at(-1).message.includes('Nota:'));
    await download(page,'orientation-es-repeat.pdf');
    assert.equal(report.mockedContacts.length,before+1,'repeat download must not send another request');
    report.interactions.push('Unknown starting point, local summary, consent, branded PDF and retry deduplication');
    await page.locator('.diagnosis-result .diagnosis-back').click();
    assert(await page.locator('input[value=unknown]').isChecked());
    await page.locator('form[data-diagnosis-step] input[value=documents]').check();
    await page.locator('form[data-diagnosis-step] button[type=submit]').click();
    await page.locator('#diagnosis-process').fill('Proceso definido de documentación.');
    await page.locator('form[data-diagnosis-step] button[type=submit]').click();
    await page.locator('form[data-diagnosis-step] button.diagnosis-back').click();
    assert.equal(await page.locator('#diagnosis-process').inputValue(),'Proceso definido de documentación.');
    report.interactions.push('Answer editing, back navigation and text preservation');
    await page.goto(base+'/en/ai-diagnosis',{waitUntil:'networkidle'});
    await finishDiagnosis(page,{area:'documents',owner:'lead',goal:'time',stage:'implementation'});
    assert.equal(await page.locator('[data-diagnosis-result]').getAttribute('data-diagnosis-result'),'implementation');
    await page.locator('#diagnosis-name').fill('Fictional QA');await page.locator('#diagnosis-company').fill('QA business');await page.locator('#diagnosis-email').fill('qa@example.invalid');await page.locator('input[name=permission]').check();
    await download(page,'orientation-en.pdf');
    report.interactions.push('English implementation route and PDF');
    await page.goto(base+'/diagnostico-ia',{waitUntil:'networkidle'});
    await finishDiagnosis(page,{area:'training',stage:'training'},false);
    assert.equal(await page.locator('[data-diagnosis-result]').getAttribute('data-diagnosis-result'),'training');
    assert((await page.locator('.diagnosis-stage-route a').getAttribute('href')).endsWith('#service-training'));
    report.interactions.push('Standalone training route');
    await ctx.close();
    const nojs=await context({javaScriptEnabled:false,viewport:{width:390,height:844}});
    for(const route of ['/','/ia-para-empresas','/documentos-e-informes','/services','/diagnostico-ia']) {
      page=await open(nojs,route);assert(await page.locator('h1').isVisible());assert(await page.locator('#site-nav').isVisible());
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(await page.locator('.contact-form').count())assert(await page.locator('.contact-form button[type=submit]').isDisabled());
      if(route==='/diagnostico-ia')assert(await page.locator('.diagnosis-question button[type=submit]').isDisabled());
      await page.close();
    }
    await nojs.close();report.interactions.push('Readable pages, navigation and disabled submission without JavaScript');
  }
  assert.deepEqual(report.pageErrors,[]);
  await fs.writeFile(path.join(out,mode+'-results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:true,layouts:report.layouts.length,interactions:report.interactions,mockedContacts:report.mockedContacts.length,realEmails:0,pageErrors:report.pageErrors}));
})().catch(async error=>{
  console.error(error.stack);process.exitCode=1;
  if(page&&!page.isClosed())await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});
  await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'failure.json'),JSON.stringify({...report,error:error.message},null,2));
}).finally(async()=>{if(browser)await browser.close();});
