// Cria a estrutura de carrosséis no projeto do usuário a partir dos templates.
// Uso: node novo-projeto.mjs [--dir carrosseis]
import {cp,access,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const flag=process.argv.indexOf('--dir');
const dir=path.resolve(flag>-1?process.argv[flag+1]:'carrosseis');
try{await access(path.join(dir,'marca/marca.json'));console.log('Já existe um projeto em',dir);process.exit(0)}catch{}
await mkdir(dir,{recursive:true});
await cp(path.join(skill,'templates/projeto'),dir,{recursive:true});
console.log('Projeto criado em',dir,'\nPróximo passo: preencher marca/marca.json, marca/manual.md e GOSTO.md pelo onboarding.');
