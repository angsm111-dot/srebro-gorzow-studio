const {chromium}=require('C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const v of [13,14,15]){
  await page.goto('http://127.0.0.1:8765/site.html?v='+v);await page.waitForSelector('#calc-form');
  assert.equal((await page.locator('#result').innerText()).replace(/\s/g,''),'277,50zł');
  await page.locator('#deduction').fill('10');assert.equal((await page.locator('#result').innerText()).replace(/\s/g,''),'249,75zł');
  await page.locator('#add-item').click();
  await page.locator('[data-kind="bars"]').click();await page.locator('#quantity').fill('2');
  assert.equal((await page.locator('#result').innerText()).replace(/\s/g,''),'599,40zł');await page.locator('#add-item').click();
  assert.equal((await page.locator('#basket-total').innerText()).replace(/\s/g,''),'849,15zł');
  await page.locator('[data-kind="coins"]').click();assert.equal((await page.locator('#result').innerText()).replace(/\s/g,''),'93,22zł');
  await page.locator('#weight').fill('-1');assert.equal(await page.locator('#add-item').isDisabled(),true);
  await page.locator('[data-price="800"]').click();assert.equal((await page.locator('#result').innerText()).replace(/\s/g,''),'240,00zł');
  await page.locator('[data-period="7"]').click();assert.equal(await page.locator('#chart-table tr').count(),7);
  await page.locator('[data-period="90"]').click();assert.equal(await page.locator('#chart-table tr').count(),90);
  await page.locator('#ask-quote').click();assert((await page.locator('#contact-message').inputValue()).includes('849,15'));
  await page.locator('#contact-name').fill('Jan Testowy');await page.locator('#contact-email').fill('jan@example.com');await page.locator('#contact-form button[type="submit"]').click();assert(await page.locator('#message-preview').isVisible());
  await page.locator('#privacy-open').click();assert(await page.locator('#privacy').isVisible());await page.locator('#privacy-close').click();
  const validLinks=await page.locator('a[href^="#"]').evaluateAll(els=>els.every(e=>document.querySelector(e.getAttribute('href'))));assert(validLinks);
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`C:/Users/HP/Documents/Codex/2026-09-28/chce/work/silver-${v}.png`,fullPage:true});
  for(const width of [390,320]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('#menu-toggle').click();assert(await page.locator('#nav').isVisible());await page.locator('#nav a[href="#kontakt"]').click();assert.equal(await page.locator('#nav').isVisible(),false);}
  await page.setViewportSize({width:1440,height:1000});
 }
 await page.goto('http://127.0.0.1:8765/#13');await page.waitForSelector('iframe');let frame=page.frames().find(f=>f.url().includes('site.html?v=13'));await frame.waitForSelector('#weight');await frame.locator('#weight').fill('234');await page.locator('#next').click();await page.locator('#prev').click();assert.equal(await frame.locator('#weight').inputValue(),'234');
 await page.locator('#prev').click();assert.equal(await page.locator('#archive-image').isVisible(),true);await page.locator('#archive-image').evaluate(img=>img.decode());
 for(let id=1;id<=12;id++){await page.locator('#project').selectOption(String(id));await page.locator('#archive-image').evaluate(img=>img.decode());}
 await page.locator('#project').selectOption('13');await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);console.log('PASS: 3 variants; calculations, invalid input, basket, chart, forms, menu anchors, mobile 320/390, state persistence, 12 archive images; zero browser errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
