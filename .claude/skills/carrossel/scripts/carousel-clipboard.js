// One PNG clipboard item: individual export, or a clearly labelled contact-sheet preview.
function carouselPngBlob(source) {
  if(source?.then)return source.then(carouselPngBlob);
  if(source.startsWith('blob:'))return fetch(source).then(response=>{if(!response.ok)throw new Error('image');return response.blob()});
  const bytes = Uint8Array.from(atob(source.split(',')[1]), character => character.charCodeAt(0));
  return new Blob([bytes], {type:'image/png'});
}
async function carouselPreviewBlob(sources) {
  const pictures = await Promise.all(sources.map(async source => {
    const picture = new Image(); picture.src = source; await picture.decode(); return picture;
  }));
  const tileWidth=648, tileHeight=810, gap=24;
  const canvas=document.createElement('canvas');
  canvas.width=pictures.length*tileWidth+(pictures.length+1)*gap; canvas.height=tileHeight+gap*2;
  const context=canvas.getContext('2d');
  context.fillStyle='#f2f6fc'; context.fillRect(0,0,canvas.width,canvas.height);
  pictures.forEach((picture,index)=>context.drawImage(picture,gap+index*(tileWidth+gap),gap,tileWidth,tileHeight));
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('preview')), 'image/png'));
}
function copyCarouselImages(sources, preview, status, buttons) {
  if(!sources?.length&&!sources?.then){status.textContent='Aguarde os slides carregarem e tente novamente.';return;}
  if(!navigator.clipboard?.write || !window.ClipboardItem){status.textContent='Este navegador não permite copiar imagens aqui. Use Baixar.';return;}
  buttons.forEach(button=>button.disabled=true);
  status.textContent=preview?'Preparando a prévia…':'Copiando…';
  try {
    // Call write synchronously in the click handler; Safari needs the original user gesture.
    const content=preview?carouselPreviewBlob(sources):Promise.resolve(carouselPngBlob(sources[0]));
    navigator.clipboard.write([new ClipboardItem({'image/png':content})]).then(()=>{
      status.textContent=preview?'Prévia com os '+sources.length+' slides copiada.':'Slide copiado. É só colar.';
    }).catch(()=>{status.textContent='Não foi possível copiar. Permita copiar imagens no navegador ou use Baixar.';})
      .finally(()=>buttons.forEach(button=>button.disabled=false));
  } catch {
    status.textContent='Não foi possível copiar a imagem. Use Baixar.';
    buttons.forEach(button=>button.disabled=false);
  }
}

async function copyCarouselSequence(sources, status, buttons, expectedCount) {
  if(!sources?.length&&!sources?.then){status.textContent='Aguarde os slides carregarem e tente novamente.';return;}
  if(!navigator.clipboard?.write || !window.ClipboardItem){status.textContent='Este navegador não permite copiar imagens aqui. Use Baixar.';return;}
  buttons.forEach(button=>button.disabled=true);
  status.textContent='Preparando as imagens…';
  let copied=0;const count=expectedCount||sources.length;const resolved=Promise.resolve(sources);
  try {
    for(let index=0;index<count;index++){const source=resolved.then(items=>items[index]);
      // Separate writes, in slide order, for clipboard-history apps to observe each image.
      await navigator.clipboard.write([new ClipboardItem({'image/png':carouselPngBlob(source)})]);
      copied++;
      status.textContent='Copiando '+copied+' de '+count+'…';
      if(copied<count)await new Promise(resolve=>setTimeout(resolve,500));
    }
    status.textContent=count+' slides copiados em sequência. Confira seu histórico.';
  } catch {
    status.textContent=copied?'Copiados '+copied+' de '+count+'. O navegador bloqueou a sequência; copie os restantes individualmente.':'O navegador bloqueou a cópia. Permita copiar imagens ou copie um slide por vez.';
  } finally {
    buttons.forEach(button=>button.disabled=false);
  }
}
