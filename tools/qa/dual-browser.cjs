const { chromium } = require('/qa/node_modules/playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const base='http://127.0.0.1:10022';
const mode=process.env.QA_MODE || 'all';
const server=spawn('node',['dist/server/entry.mjs'],{cwd:'/app',env:{...process.env,HOST:'127.0.0.1',PORT:'10022'},stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser;
(async()=>{
 for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await sleep(250);if(i===59)throw Error('Isolated built server unavailable');}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[],errors=[],requests=[],screens=[];
 let context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.pathname==='/api/contact'){ requests.push(JSON.parse(req.postData()||'{}')); return route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}); }
  if(u.origin===base||u.protocol==='data:'||u.protocol==='blob:')return route.continue();
  return route.abort();
 });
 let page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const paths=['/','/en','/ia-para-empresas','/ia-para-software','/en/ai-for-business','/en/ai-for-software'];
 if(mode !== 'interactions') {
 for(const width of [1440,1024,820,768,741,390,320]){
  await page.setViewportSize({width,height:900});
  for(const path of paths){
   const response=await page.goto(base+path,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),main:!!document.querySelector('#main-content'),heading:document.querySelector('h1')?.textContent,form:!!document.querySelector('.contact-form'),navOverflow:document.querySelector('.header-inner').scrollWidth>document.querySelector('.header-inner').clientWidth}));
   results.push({width,path,status:response.status(),...data});
   assert.equal(response.status(),200);assert.equal(data.h1,1);assert.equal(data.overflow,false,`overflow ${width} ${path}`);assert.equal(data.navOverflow,false,`nav overflow ${width} ${path}`);assert.deepEqual(data.brokenImages,[]);
   if([1440,390].includes(width)){
    const name=`${width}-${path.replaceAll('/','-')||'home'}.png`;await page.screenshot({path:'/qa/'+name,fullPage:true});screens.push(name);
   }
  }
  await fs.writeFile('/qa/layout-results.json',JSON.stringify({results,errors,screens},null,2));
  await page.close();page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 }
 }
 if(results.length) await fs.writeFile('/qa/layout-results.json',JSON.stringify({results,errors,screens},null,2));
 if(mode === 'layout') {assert.deepEqual(errors,[]);console.log(JSON.stringify({navigations:results.length,errors,screens:screens.length,status:'passed'}));return;}
 await context.close(); await browser.close();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route=>{const req=route.request(),u=new URL(req.url());if(u.pathname==='/api/contact'){requests.push(JSON.parse(req.postData()||'{}'));return route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'});}return u.origin===base||u.protocol==='data:'||u.protocol==='blob:'?route.continue():route.abort();});
 page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 // Mobile menu, keyboard focus cycle, Escape, and local contact routing.
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/ia-para-empresas');await page.locator('#cookie-decline').click();
 const toggle=page.locator('[data-menu-toggle]');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert(await page.locator('main').evaluate(e=>e.inert));
 await page.locator('.language-link').focus();await page.keyboard.press('Tab');assert(await page.locator('.site-header .brand').evaluate(e=>e===document.activeElement));
 await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert(!await page.locator('main').evaluate(e=>e.inert));
 await toggle.click();await page.locator('.nav-contact').click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(new URL(page.url()).pathname,'/ia-para-empresas');
 // Native FAQ.
 const details=page.locator('.audience-faq details').first();await details.locator('summary').click();assert(await details.evaluate(e=>e.open));await details.locator('summary').press('Enter');assert(!await details.evaluate(e=>e.open));
 // Explorer local estimate, result invalidation, deduplication and preserving visitor text.
 let localPosts=requests.length;await page.locator('#process-frequency').fill('20');await page.locator('#process-minutes').fill('15');await page.locator('[data-process-form] button').click();
 assert.equal(await page.locator('[data-process-hours]').textContent(),'5');assert.equal(requests.length,localPosts);assert(await page.locator('.diagnosis-launcher').evaluate(e=>e.classList.contains('is-hidden')));await page.locator('[data-process-result]').scrollIntoViewIfNeeded();await page.screenshot({path:'/qa/process-result-mobile.png'});
 await page.locator('#message').fill('Mi contexto original.');await page.locator('[data-process-contact]').click();let msg=await page.locator('#message').inputValue();assert(msg.startsWith('Mi contexto original.'));assert(msg.includes('5 horas/semana'));assert.equal(await page.locator('#interest').inputValue(),'business');
 await page.locator('[data-process-contact]').click();assert.equal(await page.locator('#message').inputValue(),msg);
 await page.locator('#process-frequency').fill('21');assert(await page.locator('[data-process-result]').evaluate(e=>e.hidden));
 await page.locator('[data-process-form] button').click();await page.locator('#message').fill('x'.repeat(5990));await page.locator('[data-process-contact]').click();assert.equal((await page.locator('#message').inputValue()).length,5990);assert((await page.locator('[data-process-prefill-status]').textContent()).includes('Acórtalo'));
 await page.locator('#message').fill('Consulta de prueba interceptada.');await page.locator('#name').fill('QA TenBeltz');await page.locator('#email').fill('qa@example.invalid');await page.locator('#company').fill('QA ficticio');await page.locator('.contact-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('.contact-form [name=message]').value==='');assert.equal(requests.length,localPosts+1);assert(requests.at(-1).message.includes('Interés: business'));await page.locator('.contact-feedback-message').waitFor();assert(await page.locator('.contact-form-shell .contact-feedback-message').count()===1);await page.locator('.contact-feedback-message').scrollIntoViewIfNeeded();await page.screenshot({path:'/qa/contact-feedback-mobile.png'});
 // Error preserves data; retry sends once per click, mocked only.
 await page.route('**/api/contact',r=>r.fulfill({status:500,contentType:'application/json',body:'{}'}));await page.locator('#name').fill('QA');await page.locator('#email').fill('qa@example.invalid');await page.locator('#message').fill('Conservar mensaje');await page.locator('.contact-form button[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('.contact-form button[type=submit]').disabled);assert.equal(await page.locator('#message').inputValue(),'Conservar mensaje');await page.locator('.contact-feedback-message').waitFor();await page.unroute('**/api/contact');
 // English explorer/offer/locale counterpart.
 await page.goto(base+'/en/ai-for-business');await page.locator('#process-frequency').fill('12');await page.locator('#process-minutes').fill('7.5');await page.locator('[data-process-form] button').click();assert.equal(await page.locator('[data-process-hours]').textContent(),'1.5');assert.equal(await page.locator('.language-link').getAttribute('href'),'/ia-para-empresas');
 await page.goto(base+'/ia-para-software');assert.equal(await page.locator('#interest').inputValue(),'software');assert.equal(await page.locator('.audience-hero .text-link').getAttribute('href'),'#formas-de-colaborar');
 // Existing technical self-assessment and PDF, with contact request mocked.
 await page.goto(base+'/diagnostico-ia');for(let i=0;i<10;i++){await page.locator('.diagnosis-panel input[type=radio]').first().check();await page.locator('.diagnosis-actions .button').first().click();}
 await page.locator('#diagnosis-name').fill('QA ficticio');await page.locator('#diagnosis-company').fill('TenBeltz QA');await page.locator('#diagnosis-email').fill('qa@example.invalid');await page.locator('input[name=permission]').check();const dl=page.waitForEvent('download');await page.locator('.diagnosis-lead button[type=submit]').click();await(await dl).saveAs('/qa/diagnosis-regression.pdf');
 // No JavaScript: readable routes/native FAQ, nav, local calculator disabled.
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());const np=await nojs.newPage();
 for(const path of ['/','/ia-para-empresas','/ia-para-software']){await np.goto(base+path);assert(await np.locator('h1').isVisible());assert(await np.locator('#site-nav').isVisible());assert(await np.locator('.contact-form #name').isDisabled());assert(await np.locator('.contact-form button[type=submit]').isDisabled());if(path.includes('empresas'))assert(await np.locator('[data-process-form] button').isDisabled());assert(await np.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await nojs.close();
 assert.deepEqual(errors,[]);await fs.writeFile('/qa/interaction-results.json',JSON.stringify({results,errors,mockedSuccessfulContactRequests:requests.length,mockedFailureRequests:1,realEmails:0,screens,interactions:['menu keyboard/Escape/contact','FAQ keyboard','process estimate/local-only/prefill/preserve/dedup','contact success/error','English explorer','software offers/default interest','technical diagnosis + PDF','no-JS routes/menu/calculator']},null,2));
 console.log(JSON.stringify({navigations:results.length,errors,mockedSuccessfulContactRequests:requests.length,mockedFailureRequests:1,realEmails:0,screens:screens.length,status:'passed'}));
})().catch(async e=>{console.error(e.stack);if(browser){const pages=browser.contexts().flatMap(c=>c.pages());if(pages[0])await pages[0].screenshot({path:'/qa/failure.png',fullPage:true}).catch(()=>{});}process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill();});
