import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base=process.env.SITE_URL;
assert.ok(base,'Set SITE_URL to the running development or preview server address.');
const browser=await chromium.launch({headless:true,channel:process.env.UI_BROWSER_CHANNEL || 'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
await mkdir('.qa',{recursive:true});
async function imagesReady(){await page.locator('img').evaluateAll(async images=>{images.forEach(image=>image.loading='eager');await Promise.all(images.map(image=>image.decode()));});await page.evaluate(()=>document.fonts.ready);}
try{
  const response=await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);await imagesReady();
  assert.equal(await page.locator('h1').count(),1);assert.match(await page.locator('meta[name=robots]').getAttribute('content'),/noindex, nofollow/);
  assert.match(await readFile('vercel.json','utf8'),/X-Robots-Tag/);assert.match(await readFile('public/robots.txt','utf8'),/Disallow:/);
  assert.doesNotMatch(await page.locator('main').innerText(),/Project photo placeholder|before.*after|lorem ipsum|five.star|guaranteed|certified|thousands of|A fresh start|A little care/i);
  assert.ok(await page.evaluate(()=>document.fonts.check('600 40px "Barlow Condensed"')&&document.fonts.check('400 14px Manrope')));
  assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')).filter(href=>!document.querySelector(href))),[]);
  const headerHeight=await page.locator('.masthead').evaluate(element=>element.getBoundingClientRect().height);
  assert.equal(headerHeight,138);
  await page.evaluate(()=>scrollTo(0,600));await expect(page.locator('.masthead')).toHaveClass(/is-compact/);
  await expect(page.locator('.compact-quote')).toBeVisible();assert.equal(await page.locator('.masthead').evaluate(element=>element.getBoundingClientRect().height),68);
  await page.screenshot({path:'.qa/compact-header-1440.png'});
  await page.locator('.compact-quote').click();assert.equal(new URL(page.url()).hash,'#contact');
  await page.locator('.compact-brand a').click();await expect(page.locator('.masthead')).not.toHaveClass(/is-compact/);assert.equal(await page.evaluate(()=>scrollY),0);
  const anchors=page.locator('a[href^="#"]:not(.skip-link)');const destinations=await anchors.evaluateAll(links=>links.map((link,index)=>({href:link.getAttribute('href'),index,visible:link.getBoundingClientRect().width>0})).filter(link=>link.visible));
  for(const target of destinations){await page.evaluate(()=>scrollTo(0,0));await expect(page.locator('.masthead')).not.toHaveClass(/is-compact/);await anchors.nth(target.index).click();assert.equal(new URL(page.url()).hash,target.href);}
  for(let i=0;i<3;i++){await page.locator('.service-enquiry').nth(i).click();await expect(page.getByLabel('Service required',{exact:true})).toHaveValue(['Carpet & upholstery cleaning','Window cleaning','Garden services'][i]);}
  for(let i=0;i<2;i++){await page.locator('.area-name a').nth(i).click();await expect(page.getByLabel('Location',{exact:true})).toHaveValue(['Johannesburg','Plettenberg Bay'][i]);}
  await page.locator('.area-name a').first().click();
  for(let i=0;i<4;i++){await page.locator('.gallery-open').nth(i).click();await expect(page.locator('.gallery-dialog')).toBeVisible();await expect(page.locator('.gallery-dialog-bottom strong')).toHaveText(['Carpet care','Garden maintenance','Window cleaning','Deep carpet cleaning'][i]);await page.keyboard.press('Escape');}
  await page.locator('.gallery-open').first().click();await page.getByRole('button',{name:'Next photograph'}).click();await expect(page.locator('.gallery-dialog-bottom strong')).toHaveText('Garden maintenance');await page.keyboard.press('ArrowRight');await expect(page.locator('.gallery-dialog-bottom strong')).toHaveText('Window cleaning');await page.getByRole('button',{name:'Previous photograph'}).click();await expect(page.locator('.gallery-dialog-bottom strong')).toHaveText('Garden maintenance');await page.getByRole('button',{name:'Close gallery'}).click();
  await expect(page.locator('.testimonials')).toContainText('Sarah L.');await expect(page.locator('.testimonials')).toContainText('David F.');
  await page.getByRole('button',{name:'Request a Quote',exact:true}).click();assert.equal(await page.locator('.enquiry-dialog[open]').count(),0);
  await page.getByLabel('Name',{exact:true}).fill('Test Visitor');await page.getByLabel('Phone',{exact:true}).fill('invalid');assert.equal(await page.getByLabel('Phone',{exact:true}).evaluate(input=>input.checkValidity()),false);
  await page.getByLabel('Phone',{exact:true}).fill('082 123 4567');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Description of work').fill('A test enquiry only.');
  await page.getByLabel('Add photographs',{exact:true}).setInputFiles('public/images/cleanest-logo.png');await expect(page.getByRole('status')).toContainText('cleanest-logo.png');
  let posts=0;page.on('request',request=>{if(request.method()==='POST')posts++;});
  await page.getByRole('button',{name:'Request a Quote',exact:true}).click();await expect(page.locator('.enquiry-dialog')).toBeVisible();const summary=await page.locator('.enquiry-dialog pre').innerText();for(const value of ['Test Visitor','082 123 4567','test@example.com','Johannesburg','Garden services','Photos selected: 1'])assert.ok(summary.includes(value));assert.equal(posts,0);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Remove photographs'}).click();assert.equal(await page.locator('input[type=file]').evaluate(input=>input.files.length),0);
  assert.ok(await page.locator('a[href="https://wa.me/27834402603"]').count()>=2);assert.ok(await page.locator('a[href="tel:+27834402603"]').count()>=3);for(const email of ['simone@cleanest.co.za','jason@cleanest.co.za'])assert.equal(await page.locator(`a[href="mailto:${email}"]`).count(),2);
  assert.equal(await page.locator('a[href="https://www.facebook.com/cleanestsa"]').count(),1);
  for(const width of [768,1024,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo(0,600));await expect(page.locator('.masthead')).toHaveClass(/is-compact/);await page.getByRole('navigation').getByRole('link',{name:'Services',exact:true}).click();await page.waitForTimeout(250);const position=await page.evaluate(()=>({section:document.querySelector('#services').getBoundingClientRect().top,header:document.querySelector('.masthead').getBoundingClientRect().bottom}));assert.ok(position.section>=position.header,'Anchor heading clears compact header');}
  for(const width of [320,390,768,1024,1440,1920]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)});await page.waitForTimeout(60);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);await page.screenshot({path:`.qa/full-${width}.png`,fullPage:true});
    for(const selector of ['.hero','.service-directory','.about-section','.gallery-grid','.area-directory','.testimonials','.contact-layout','.footer-main']){const overflow=await page.locator(selector).evaluate(element=>[...element.querySelectorAll('h1,h2,h3,p,a,button,input,select,textarea,img')].filter(item=>{const rect=item.getBoundingClientRect();return rect.width>0&&(rect.left< -1||rect.right>innerWidth+1)}).map(item=>item.tagName));assert.deepEqual(overflow,[],`${selector} bounds at ${width}`);if([320,390,768,1440].includes(width))await page.locator(selector).screenshot({path:`.qa/${selector.slice(1)}-${width}.png`,style:'.masthead,.skip-link{visibility:hidden!important}'});}
  }
  for(const width of [320,390]){await page.setViewportSize({width,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('button',{name:'Close navigation'})).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation').getByRole('link',{name:'Services',exact:true}).click();await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');assert.equal(new URL(page.url()).hash,'#services');}
  for(const width of [390,1440]){await page.setViewportSize({width,height:width===390?844:1000});await page.goto(base,{waitUntil:'networkidle'});await imagesReady();await page.screenshot({path:`.qa/hero-preview-${width}.png`});}
  await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>scrollTo({top:100,behavior:'instant'}));await page.waitForTimeout(350);await expect(page.locator('.masthead')).toHaveClass(/is-compact/);assert.equal(await page.evaluate(()=>scrollY),100,'Header transition does not move the document');
  assert.deepEqual(errors,[]);console.log('PASS: full/compact header, transition stability, desktop/tablet anchor clearance, all navigation/CTAs, 6 widths, loaded images/fonts, gallery enlargement and keyboard controls, source testimonials, area/service selection, mobile navigation, form validation, local photo selection/removal, zero POST requests/browser errors, no before/after placeholders and noindex.');
}finally{await browser.close();}
