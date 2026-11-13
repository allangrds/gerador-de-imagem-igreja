// Contexto compartilhado: pasta do projeto (--dir), marca (marca/marca.json) e escrita com a identidade aplicada.
import {readFile,writeFile as fsWrite} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const skillRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const flag=process.argv.indexOf('--dir');
export const dir=path.resolve(flag>-1?process.argv[flag+1]:'carrosseis');
export const args=process.argv.slice(2).filter((a,i,all)=>a!=='--dir'&&all[i-1]!=='--dir');
let marca;
try{marca=JSON.parse(await readFile(path.join(dir,'marca/marca.json'),'utf8'))}
catch{throw new Error(`Não achei ${path.join(dir,'marca/marca.json')}. Rode o onboarding da skill primeiro ou passe --dir.`)}
export const brand=marca;
const fam=marca.fonte?.familia||'Inter';
const files=marca.fonte?.arquivos||{};
const faces=await Promise.all(Object.entries(files).map(async([w,f])=>`@font-face{font-family:${fam};src:url(data:font/woff2;base64,${(await readFile(path.join(dir,'marca',f))).toString('base64')}) format('woff2');font-weight:${w};font-display:swap}`));
// Sem arquivos locais, cai no Google Fonts (precisa de rede para abrir a galeria).
export const fontFaces=faces.length?faces.join(''):marca.fonte?.css?`@import url('${marca.fonte.css}');`:`@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam)}:wght@400;500;700&display=swap');`;
const logo=marca.logo?path.join(dir,'marca',marca.logo):null;
export const mark=logo?`data:${logo.endsWith('.svg')?'image/svg+xml':'image/png'};base64,${(await readFile(logo)).toString('base64')}`:'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${marca.cores?.primaria||'#0869f5'}"/></svg>`);
// Os templates da galeria foram escritos com a marca de origem; aqui viram a marca do projeto.
export function brandify(text){
 return text.replaceAll('Satoshi',fam).replaceAll('#0869f5',marca.cores?.primaria||'#0869f5').replaceAll('#0869F5',marca.cores?.primaria||'#0869F5').replaceAll('#f8faff',marca.cores?.fundo||'#f8faff')
  .replaceAll('Feito para dar voz às suas ideias.',marca.tagline||'').replace(/Oratry(?![A-Za-z])/g,marca.nome||'Marca');
}
export const writeFile=(file,data,...rest)=>fsWrite(file,typeof data==='string'&&/\.html?$/.test(String(file))?brandify(data):data,...rest);
