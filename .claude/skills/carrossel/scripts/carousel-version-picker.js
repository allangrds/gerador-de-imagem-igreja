function enhanceVersionSelect(select) {
  if(!select || select._picker)return;
  const picker=document.createElement('details');picker.className='version-picker';
  const summary=document.createElement('summary');summary.innerHTML='<span class="version-value"></span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg>';
  const menu=document.createElement('div');menu.className='version-menu';menu.setAttribute('aria-label','Escolher versão');
  [...select.options].forEach(option=>{
    const button=document.createElement('button');button.type='button';button.className='version-option';
    const badge=document.createElement('span');badge.className='version-badge';badge.textContent=option.textContent.split(' · ')[0];
    const label=document.createElement('span');label.className='version-option-label';label.textContent=option.textContent.split(' · ').slice(1).join(' · ')||'Versão original';
    const tick=document.createElement('span');tick.className='version-tick';tick.textContent='✓';
    button.append(badge,label,tick);button.dataset.value=option.value;
    button.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));picker.open=false;syncVersionSelect(select);summary.focus()};menu.append(button);
  });
  picker.append(summary,menu);select.hidden=true;select.after(picker);select._picker=picker;
  document.addEventListener('click',event=>{if(!picker.contains(event.target))picker.open=false});
  picker.addEventListener('keydown',event=>{if(event.key==='Escape'){picker.open=false;summary.focus();event.preventDefault();event.stopPropagation()}});
  syncVersionSelect(select);
}
function syncVersionSelect(select) {
  const picker=select?._picker;if(!picker)return;
  picker.querySelector('.version-value').textContent=select.selectedOptions[0]?.textContent||'Escolher versão';
  picker.querySelectorAll('.version-option').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.value===select.value)));
}
function revealCompareChoice(panel, shown) {
  if(!panel || panel.dataset.visible===String(shown))return;
  panel.dataset.visible=String(shown);
  const previous=panel._revealAnimation;
  const wasHidden=panel.hidden;
  // Read the interpolated state before cancelling an interrupted transition.
  const style=getComputedStyle(panel);
  const startHeight=wasHidden?0:panel.getBoundingClientRect().height;
  const startOpacity=wasHidden?0:Number(style.opacity);
  const gap=parseFloat(getComputedStyle(panel.parentElement).rowGap)||0;
  const startMargin=wasHidden?-gap:parseFloat(style.marginBottom)||0;
  panel._revealAnimation=null;
  previous?.cancel();
  const reset=()=>{
    for(const key of ['height','opacity','transform','overflow','marginBottom'])panel.style[key]='';
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches || (!shown && wasHidden)){
    panel.hidden=!shown;reset();return;
  }
  if(!shown)panel.querySelectorAll('details[open]').forEach(picker=>picker.open=false);
  panel.hidden=false;
  reset();
  const expanded=panel.getBoundingClientRect().height;
  panel.style.overflow='hidden';
  const from={height:startHeight+'px',opacity:startOpacity,marginBottom:startMargin+'px'};
  const to={height:(shown?expanded:0)+'px',opacity:shown?1:0,marginBottom:(shown?0:-gap)+'px'};
  const animation=panel.animate([from,to],{
    duration:220,easing:'cubic-bezier(.22,.8,.23,1)',fill:'both'
  });
  panel._revealAnimation=animation;
  animation.finished.then(()=>{
    if(panel._revealAnimation!==animation)return;
    // Hide while the final collapsed frame still applies, then release its styles.
    panel.hidden=!shown;
    panel._revealAnimation=null;
    animation.cancel();
    reset();
  }).catch(()=>{});
}
