for(const dialog of document.querySelectorAll('[data-video-dialog]')){
 const data=JSON.parse(dialog.querySelector('.video-data').textContent),video=dialog.querySelector('video'),target=dialog.querySelector('.video-target'),html=dialog.querySelector('.motion-html-frame');
 let selected=0,token=0,opener=null,flight=null,htmlState={time:0,playing:false,muted:true};
 const htmlVersion=()=>data.versions[selected]?.type==='html';
 const sendHTML=(type,value)=>html.contentWindow?.postMessage({channel:'oratry-motion-preview',type,value},'*');
 const pauseAll=()=>{video.pause();sendHTML('pause');htmlState.playing=false;};
 const setVersion=async(index,preserve=false)=>{
  const generation=++token,item=data.versions[index],time=preserve?(htmlVersion()?htmlState.time:video.currentTime):0,playing=preserve&&(htmlVersion()?htmlState.playing:!video.paused),muted=htmlVersion()?htmlState.muted:video.muted;
  pauseAll();selected=index;const isHTML=item.type==='html';video.hidden=isHTML;html.hidden=!isHTML;
  dialog.querySelectorAll('[data-video-version]').forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.videoVersion)===index)));
  dialog.querySelector('.video-version-label').textContent=item.label;
  const download=dialog.querySelector('.video-download'),open=dialog.querySelector('.motion-html-open');download.hidden=isHTML;open.hidden=!isHTML&&!item.sourceHtml;if(isHTML){open.href=item.src;open.innerHTML='Abrir estudo separado <span>↗</span>';}else{download.href=item.src;if(item.sourceHtml){open.href=item.sourceHtml;open.innerHTML='Ver HTML original <span>↗</span>';}}
  dialog.querySelector('.caption-field').value=item.caption;dialog.querySelector('.video-download-status').textContent='';
  const arrive=()=>{if(preserve&&!flight&&!matchMedia('(prefers-reduced-motion: reduce)').matches)target.animate([{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.22,.8,.23,1)'});};
  if(isHTML){
   const src=item.src+(item.src.includes('?')?'&':'?')+'embed=1';
   const reveal=()=>{if(generation!==token||!dialog.open)return;htmlState={time,playing,muted};sendHTML('configure',{time,playing,muted});arrive();};
   html.onload=()=>{html.dataset.ready='true';reveal();};
   if(html.getAttribute('src')!==src){html.dataset.ready='false';html.src=src;}else if(html.dataset.ready==='true')reveal();
   return;
  }
  const reveal=()=>{
   if(generation!==token)return;
   video.currentTime=Math.min(time,Math.max(0,video.duration-.05));video.muted=muted;arrive();
   if(playing)video.play().catch(()=>{});
  };
  if(video.getAttribute('src')!==item.src){video.poster=item.cover;video.onloadedmetadata=reveal;video.src=item.src;video.load();}else reveal();
 };
 const restore=()=>{if(flight){const badge=flight.querySelector('.play-mark');if(badge)badge.hidden=false;restoreCard(flight);flight=null;}target.style.opacity='';};
 document.querySelectorAll('[data-video-open="'+dialog.id+'"]').forEach(button=>button.onclick=()=>{
  opener=button;const source=button.querySelector('.cover'),r=source.getBoundingClientRect(),w=source.clientWidth,h=source.clientHeight;
  setVersion(0);dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.close-video-dialog').focus({preventScroll:true});
  if(!htmlVersion()){video.currentTime=0;video.play().catch(()=>{});}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const start={left:r.left+(r.width-w)/2,top:r.top+(r.height-h)/2,width:w,height:h},end=target.getBoundingClientRect();
  source._originalClass=source.className;source._originalStyle=source.style.cssText;
  const placeholder=document.createElement('span');placeholder.className='flight-placeholder';placeholder.style.aspectRatio='9/16';source.replaceWith(placeholder);source._placeholder=placeholder;flight=source;
  source.querySelector('.play-mark').hidden=true;source.className='gallery-flight';Object.assign(source.style,{position:'fixed',left:start.left+'px',top:start.top+'px',width:w+'px',height:h+'px',transformOrigin:'center',willChange:'transform'});dialog.append(source);target.style.opacity='0';
  const generation=token;
  source.animate([{transform:'translate(0,0) rotate(-3deg) scale(1)'},{transform:'translate('+(end.left+end.width/2-start.left-w/2)+'px,'+(end.top+end.height/2-start.top-h/2)+'px) rotate(0) scale('+end.width/w+')'}],{duration:440,easing:'cubic-bezier(.22,.78,.22,1)',fill:'forwards'}).finished.then(()=>{if(dialog.open&&generation===token)restore();}).catch(()=>{});
 });
 dialog.querySelector('.video-download').onclick=event=>{event.preventDefault();const item=data.versions[selected];if(item.type!=='video'||!item.download)return;window.OratryDownloadVideo({...item.download,button:event.currentTarget,status:dialog.querySelector('.video-download-status')}).catch(()=>{});};
 dialog.querySelectorAll('[data-video-version]').forEach(button=>button.onclick=()=>{restore();setVersion(Number(button.dataset.videoVersion),true);});
 dialog.querySelector('.close-video-dialog').onclick=()=>{pauseAll();dialog.close();};
 dialog.addEventListener('cancel',pauseAll);
 dialog.addEventListener('close',()=>{++token;pauseAll();restore();document.body.style.overflow='';opener?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)){pauseAll();dialog.close();}});
 window.addEventListener('message',event=>{
  if(event.source!==html.contentWindow||event.data?.channel!=='oratry-motion-preview')return;
  if(event.data.type==='state'&&htmlVersion())htmlState=event.data.value;
  if(event.data.type==='requestClose'&&dialog.open&&htmlVersion()){pauseAll();dialog.close();}
 });
}
