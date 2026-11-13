// Small ZIP writer for the offline carousel viewer. PNGs are stored without recompression.
function createCarouselZip(files) {
  const table = new Uint32Array(256);
  for (let i=0;i<256;i++) { let c=i; for(let j=0;j<8;j++) c=(c&1)?0xedb88320^(c>>>1):c>>>1; table[i]=c>>>0; }
  const crc32 = bytes => { let c=0xffffffff; for(const b of bytes)c=table[(c^b)&255]^(c>>>8); return (c^0xffffffff)>>>0; };
  const chunks=[],directory=[];let offset=0;
  for(const file of files){
    const name=new TextEncoder().encode(file.name), bytes=file.bytes, crc=crc32(bytes);
    const local=new Uint8Array(30+name.length),l=new DataView(local.buffer);
    l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(12,33,true);l.setUint32(14,crc,true);l.setUint32(18,bytes.length,true);l.setUint32(22,bytes.length,true);l.setUint16(26,name.length,true);local.set(name,30);
    chunks.push(local,bytes);
    const entry=new Uint8Array(46+name.length),d=new DataView(entry.buffer);
    d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,33,true);d.setUint32(16,crc,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);entry.set(name,46);directory.push(entry);offset+=local.length+bytes.length;
  }
  const size=directory.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22),e=new DataView(end.buffer);
  e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,offset,true);
  return new Blob([...chunks,...directory,end],{type:'application/zip'});
}
