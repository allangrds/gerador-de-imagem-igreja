# Gerador para IASD Belém

Ferramentas para a equipe de mídia da Comunidade Adventista do Belém criar as artes da igreja no layout oficial, direto no navegador.

![CI](https://github.com/allangrds/gerador-de-imagem-igreja/workflows/CI/badge.svg?branch=main)

---

## Ferramentas

- **Thumbnail para YouTube** (`/thumbnail-youtube`): título da mensagem, nome do pregador e foto, com prévia ao vivo e download em JPG 1280 × 720.
- **Boletim em PDF** (`/boletim`): páginas prontas (capa, calendário, evento, imagem, comunicado, fotos, dízimos com PIX copia e cola, grupo do WhatsApp e página final), na ordem que você escolher. O PDF tem texto selecionável e links clicáveis. Capa, WhatsApp e página final ficam salvos no aparelho.
- **Agenda para Instagram** (`/agenda-instagram`): carrossel 4:5 com capa, imagens de datas (até 4 eventos cada) e imagem final, baixado como um `.zip` de JPGs 1080 × 1350 numerados na ordem.
- **Mensagens para WhatsApp** (`/mensagens-whatsapp`): convite para o culto, ao vivo, aviso, evento com inscrição, aniversariantes e boas-vindas. Mostra a prévia como no WhatsApp, copia o texto com *negrito* e _itálico_ e abre direto no app. Os campos ficam salvos no aparelho.

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

Vite, React 19, TypeScript, React Router e CSS Modules. O JPG é desenhado num `<canvas>` (`src/tools/youtube-thumbnail/exportImage.ts`), com as mesmas medidas da prévia. O boletim usa `@react-pdf/renderer`, carregado só na hora do download; a Gill Sans entra no PDF em TTF porque o fontkit não recorta os acentos do WOFF2. As fontes (Cabin, Lato e Gill Sans) são servidas pelo próprio site, então a arte sai igual em qualquer computador.
