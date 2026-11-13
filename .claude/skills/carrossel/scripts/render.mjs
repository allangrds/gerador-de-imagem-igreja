// Renderiza os slides HTML de uma versão em PNG 1x e 2x.
// Uso: node render.mjs <id>/<versão> [--dir carrosseis]   ex.: node render.mjs preco/v1
import {readdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {dir,args} from './brand.mjs';
const require=createRequire(import.meta.url);
let chromium;
try{({chromium}=require('playwright'))}catch{throw new Error('Falta o Playwright. Rode: node scripts/checar-setup.mjs')}
const target=args[0];
if(!target)throw new Error('Informe a pasta da versão: node render.mjs <id>/<versão>');
const folder=path.join(dir,target);
const slides=(await readdir(folder)).filter(f=>/^slide-\d+\.html$/.test(f)).sort();
if(!slides.length)throw new Error('Nenhum slide-NN.html em '+folder);
const browser=await chromium.launch();
for(const file of slides){
 for(const scale of [1,2]){
  const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:scale});
  await page.goto(pathToFileURL(path.join(folder,file)).href,{waitUntil:'networkidle'});
  // O slide pode declarar outro tamanho: <body data-size="1600x900">.
  const size=await page.evaluate(()=>document.body.dataset.size);
  if(size){const [w,h]=size.split('x').map(Number);await page.setViewportSize({width:w,height:h})}
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({path:path.join(folder,file.replace('.html',scale===2?'-2x.png':'.png'))});
  await page.close();
 }
 console.log('ok',file);
}
await browser.close();
