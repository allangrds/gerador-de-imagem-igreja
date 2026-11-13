(()=>{
 const loads=new Map(),blobs=new Map();
 function load(src){if(!loads.has(src))loads.set(src,new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{loads.delete(src);script.remove();reject(new Error('Não foi possível preparar o arquivo para download.'));};document.head.append(script);}));return loads.get(src);}
 window.OratryDownloadVideo=async({bundle,key,button,status})=>{
  if(button?.dataset.downloading==='true')return;
  if(button){button.dataset.downloading='true';button.setAttribute('aria-busy','true');}if(status)status.textContent='Preparando o arquivo original…';
  try{
   if(!blobs.has(key)){
    await load(bundle);const asset=globalThis.OratryVideoDownloads?.[key];if(!asset)throw new Error('Arquivo de download indisponível.');
    const parts=[];for(const chunk of asset.chunks){const raw=atob(chunk),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);parts.push(bytes);}
    const blob=new Blob(parts,{type:'application/octet-stream'});if(blob.size!==asset.size)throw new Error('O arquivo de download está incompleto.');
    blobs.set(key,{url:URL.createObjectURL(blob),filename:asset.filename});delete globalThis.OratryVideoDownloads[key];
   }
   const asset=blobs.get(key),link=document.createElement('a');link.href=asset.url;link.download=asset.filename;link.hidden=true;document.body.append(link);link.click();link.remove();
   if(status)status.textContent='Download solicitado ao navegador.';
  }catch(error){if(status)status.textContent=error.message||'Não foi possível iniciar o download.';throw error;}
  finally{if(button){delete button.dataset.downloading;button.removeAttribute('aria-busy');}}
 };
 document.addEventListener('click',event=>{const link=event.target.closest?.('[data-video-download-key]');if(!link)return;event.preventDefault();let status=link.nextElementSibling;if(!status?.matches('.video-download-status')){status=document.createElement('span');status.className='video-download-status';status.setAttribute('role','status');link.after(status);}window.OratryDownloadVideo({bundle:link.dataset.videoDownloadBundle,key:link.dataset.videoDownloadKey,button:link,status}).catch(()=>{});});
})();
