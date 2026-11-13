// Confere Node, dependências e navegador antes do primeiro uso.
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const issues=[];
if(Number(process.versions.node.split('.')[0])<18)issues.push(`Node ${process.versions.node} é antigo; use 18 ou mais novo.`);
for(const dep of ['playwright','sharp'])try{require.resolve(dep)}catch{issues.push(`Falta ${dep}: npm install --prefix "${skill}"`)}
if(!issues.length)try{const {chromium}=require('playwright');const b=await chromium.launch();await b.close()}catch{issues.push(`Falta o Chromium do Playwright: npx --prefix "${skill}" playwright install chromium`)}
console.log(issues.length?'Pendências:\n- '+issues.join('\n- '):'Tudo pronto.');
process.exit(issues.length?1:0);
