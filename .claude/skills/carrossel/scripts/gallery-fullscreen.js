(()=>{
const expand='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg>';
const collapse='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h4V4m12 4h-4V4M8 20v-4H4m12 4v-4h4"/></svg>';
for(const pane of document.querySelectorAll('.viewer-pane')){
 const owner=pane.closest('dialog'),frame=pane.querySelector('iframe'),button=document.createElement('button');let state=null,pending=null,cache=null,busy=false;
 button.type='button';button.className='preview-fullscreen';button.innerHTML=expand;button.setAttribute('aria-label','Ver post em tela cheia');button.title='Tela cheia';pane.append(button);
 window.addEventListener('message',e=>{if(e.source!==frame.contentWindow)return;if(e.data?.channel==='oratry-viewer'&&e.data.type==='state'&&e.data.ready){state=e.data;if(cache&&(cache.current!==state.current||cache.version!==state.versionA))cache=null}if(e.data?.channel==='oratry-preview'&&pending){cache=e.data;pending.resolve(e.data);clearTimeout(pending.timer);pending=null}});
 function preview(){if(cache&&cache.current===state?.current&&cache.version===state?.versionA)return Promise.resolve(cache);if(pending)return pending.promise;let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});pending={promise,resolve,reject,timer:setTimeout(()=>{pending=null;reject(new Error('Preview indisponível'))},3000)};frame.contentWindow.postMessage({channel:'oratry-viewer',type:'requestPreview'},'*');return promise}
 button.addEventListener('pointerenter',()=>preview().catch(()=>{}));button.addEventListener('focus',()=>preview().catch(()=>{}));
 button.onclick=async()=>{if(busy)return;busy=true;button.disabled=true;try{
 const data=await preview(),image=document.createElement('img');image.src=data.image;image.alt='Post em tela cheia';image.className='post-fullscreen-art';await image.decode();
 const area=frame.getBoundingClientRect(),r=state?.cardRect;const start=r?{left:area.left+r.left,top:area.top+r.top,width:r.width,height:r.height}:pane.getBoundingClientRect();
 const overlay=document.createElement('dialog');overlay.className='post-fullscreen';const exit=document.createElement('button');exit.type='button';exit.className='post-fullscreen-exit';exit.innerHTML=collapse;exit.setAttribute('aria-label','Sair da tela cheia');exit.title='Sair da tela cheia';overlay.append(image,exit);document.body.append(overlay);
 const bg=getComputedStyle(pane).backgroundColor;let closing=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?0:480,easing='cubic-bezier(.22,.8,.22,1)';
 function fit(){const h=Math.max(1,innerHeight-72),w=Math.min(innerWidth-48,h*.8);return {left:(innerWidth-w)/2,top:(innerHeight-w*1.25)/2,width:w,height:w*1.25}}
 let end=fit();function position(){end=fit();Object.assign(image.style,{left:end.left+'px',top:end.top+'px',width:end.width+'px',height:end.height+'px'})}position();
 const transform=()=> 'translate('+(start.left-end.left)+'px,'+(start.top-end.top)+'px) scale('+start.width/end.width+','+start.height/end.height+')';
 const finish='translate(0,0) scale(1)';image.style.transform=transform();const holdCancel=e=>e.preventDefault();overlay.addEventListener('cancel',holdCancel);overlay.showModal();overlay.animate([{backgroundColor:'transparent'},{backgroundColor:bg}],{duration,easing,fill:'forwards'});const opening=image.animate([{transform:transform(),borderRadius:'5px'},{transform:finish,borderRadius:'5px'}],{duration,easing,fill:'forwards'});await opening.finished.catch(()=>{});image.style.transform=finish;opening.cancel();overlay.removeEventListener('cancel',holdCancel);
 async function close(){if(closing)return;closing=true;exit.disabled=true;overlay.animate([{backgroundColor:bg},{backgroundColor:'transparent'}],{duration,easing,fill:'forwards'});await image.animate([{transform:finish},{transform:transform()}],{duration,easing,fill:'forwards'}).finished.catch(()=>{});overlay.close();overlay.remove();window.removeEventListener('resize',position);button.focus()}
 exit.onclick=close;overlay.addEventListener('cancel',event=>{event.preventDefault();close()});overlay.addEventListener('click',event=>{if(event.target===overlay)close()});window.addEventListener('resize',position);
 }catch(error){button.title='Não foi possível abrir. Tente novamente.'}finally{button.disabled=false;busy=false}};
}
})();
