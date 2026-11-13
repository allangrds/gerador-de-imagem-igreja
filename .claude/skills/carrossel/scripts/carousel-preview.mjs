import {createRequire} from 'node:module';
import path from 'node:path';
import os from 'node:os';
const require=createRequire(import.meta.url);
let sharp;
try{sharp=require('sharp')}catch{throw new Error('Falta o sharp. Rode: npm install --prefix '+path.resolve(path.dirname(new URL(import.meta.url).pathname),'..'))}
export async function carouselPreview(bytes){return sharp(bytes).resize({width:1440,withoutEnlargement:true}).webp({quality:94,smartSubsample:true,effort:4}).toBuffer()}
