# Entrega

## 1. Arquivos
`carrosseis/<id>/v<N>/`: `slide-NN.html`, `slide-NN.png` (1080×1350) e `slide-NN-2x.png` (2160×2700), gerados por `render.mjs`.

## 2. Registro
Adicionar em `carrosseis.json` (tema novo = item novo; revisão = versão nova no mesmo item, e todas as versões precisam do mesmo número de slides):
```json
{
  "id": "preco",
  "title": "Título do carrossel",
  "description": "Uma linha sobre o tema",
  "createdAt": "AAAA-MM-DD",
  "slideCount": 5,
  "status": "Em revisão · não publicado",
  "cover": "preco/v1/slide-01.png",
  "viewer": "preco/v1/ver-carrossel.html",
  "versions": [{"label": "v1 · descrição curta", "href": "preco/v1/ver-carrossel.html"}],
  "caption": "Legenda pronta para colar",
  "hashtags": [],
  "platforms": ["Instagram"]
}
```
Atualize `updatedAt`.

## 3. Slider e galeria
```
node <skill>/scripts/build-viewer.mjs <id> --dir carrosseis
node <skill>/scripts/build-gallery.mjs --dir carrosseis
```
O slider tem navegação, comparação lado a lado entre versões, legenda com botão de copiar, download do slide e ZIP do carrossel em 2x.

## 4. Mostrar
Abra `carrosseis/index.html` (ou o `ver-carrossel.html`) e mostre ao usuário, com a capa recomendada e a legenda.
