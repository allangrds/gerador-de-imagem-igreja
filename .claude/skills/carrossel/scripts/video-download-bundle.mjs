import {readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
// Deferred local scripts avoid fetching file:// media and preserve the MP4 byte for byte.
export async function videoDownloadBundle(dir,src){
 const folder=path.posix.dirname(src),href=folder+'/export-video.js',file=path.resolve(dir,src),output=path.resolve(dir,href);
 const current=await stat(file);let stale=true;try{stale=(await stat(output)).mtimeMs<current.mtimeMs}catch{}
 if(stale){
  const bytes=await readFile(file),base64=bytes.toString('base64'),chunks=[];for(let i=0;i<base64.length;i+=1048576)chunks.push(base64.slice(i,i+1048576));
  const filename='oratry-'+folder.replaceAll('/','-')+'.mp4';
  await writeFile(output,'globalThis.OratryVideoDownloads??=Object.create(null);globalThis.OratryVideoDownloads['+JSON.stringify(src)+']='+JSON.stringify({chunks,filename,size:bytes.length})+';\n');
 }
 return {bundle:href,key:src};
}
