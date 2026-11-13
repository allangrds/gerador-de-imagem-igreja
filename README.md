# Gerador para IASD Belém

Ferramentas para a equipe de mídia da Comunidade Adventista do Belém criar as artes da igreja no layout oficial, direto no navegador.

![CI](https://github.com/allangrds/gerador-de-imagem-igreja/workflows/CI/badge.svg?branch=main)

---

## Ferramentas

- **Thumbnail para YouTube** (`/thumbnail-youtube`): título da mensagem, nome do pregador e foto, com prévia ao vivo e download em JPG 1280 × 720.

Novas ferramentas entram em `src/tools/registry.ts` e ganham uma rota em `src/App.tsx`.

## Sumário

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Testes e lint](#testes-e-lint)
- [Build e deploy](#build-e-deploy)

## Requisitos

- Node 22 (veja `.nvmrc`)
- npm 10

## Instalação

```bash
npm install
```

## Uso

```bash
npm run dev
```

O site abre em http://localhost:3000.

## Testes e lint

```bash
npm test
npm run lint
npm run typecheck
```

## Build e deploy

```bash
npm run build
```

O resultado fica em `dist/`. O site é estático e funciona no Netlify ou na Vercel:

- **Comando de build:** `npm run build`
- **Pasta publicada:** `dist`

As rotas são do lado do cliente. `public/_redirects` (Netlify) e `vercel.json` (Vercel) mandam qualquer caminho para o `index.html`.

## Stack

Vite, React 19, TypeScript, React Router e CSS Modules. O JPG é desenhado num `<canvas>` (`src/tools/youtube-thumbnail/exportImage.ts`), com as mesmas medidas da prévia. As fontes (Cabin, Lato e Gill Sans) são servidas pelo próprio site, então a arte sai igual em qualquer computador.
