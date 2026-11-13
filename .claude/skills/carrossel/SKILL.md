---
name: carrossel
description: Cria carrosséis e posts estáticos com a identidade da marca (Instagram, X, LinkedIn), do roteiro ao PNG em alta, com galeria, slider, comparação de versões e legenda. Use quando o usuário pedir carrossel, post, capa, slide para redes sociais, ou quiser montar a identidade visual da marca para posts.
---

# /carrossel

Workflow para produzir carrosséis com cara de marca, não de template. A qualidade vem de quatro coisas: **roteiro antes do visual**, **a galeria como referência**, **assets próprios** e **checagem visual de cada render**. Siga a ordem abaixo; não pule etapas.

Caminhos: `<skill>` é a pasta deste arquivo. Rode os scripts da raiz do projeto do usuário; `--dir` é relativo a ela. O projeto do usuário fica em `carrosseis/` na raiz do repositório dele (ou outro caminho passado com `--dir`).

## 0. Primeira vez no projeto

1. `node <skill>/scripts/checar-setup.mjs`. Se faltar algo, mostre o comando exato ao usuário (normalmente `npm install --prefix <skill>` e `npx --prefix <skill> playwright install chromium`).
2. Se `carrosseis/marca/marca.json` não existe: `node <skill>/scripts/novo-projeto.mjs` e faça o onboarding.
   - Pergunte: **a marca já tem identidade** (logo, cores, posts) **ou vamos criar do zero?**
   - Já tem: siga `references/onboarding-marca-existente.md`.
   - Do zero: siga `references/onboarding-marca-nova.md`.
3. O onboarding termina com `marca/marca.json`, `marca/manual.md`, `GOSTO.md` iniciado e, se possível, uma série de assets (`references/image-gen.md`).

## 1. Antes de qualquer peça: ler

Sempre, nesta ordem: `carrosseis/GOSTO.md`, `carrosseis/marca/manual.md`, `carrosseis/carrosseis.json` (o que já existe e foi aprovado) e os `manifest.json` em `carrosseis/assets/`.

Ao sugerir temas, confira a galeria para não repetir o que já foi feito.

## 2. Roteiro primeiro

Siga `references/roteiro.md`. Entregue **só texto**: um bloco por slide, de 4 a 7 slides, capa com 2 ou 3 opções. **Não desenhe nada até o usuário aprovar o roteiro.**

## 3. Visual

Siga `references/visual.md`. Resumo:
- Parta das peças aprovadas na galeria, não de um layout novo a cada vez.
- Use `templates/slide-base.html` como esqueleto. Ele não lê o `marca.json`: troque à mão os tokens do `:root`, o `<link>` da fonte e o nome da marca pelos valores de `marca.json`.
- Um foco por slide. Assets grandes, integrados à composição. Prints reais quando falar de produto.
- Se nenhum asset da biblioteca servir, **não invente nem gere sozinho**: diga qual asset falta e entregue o prompt pronto (`references/image-gen.md`) para o usuário gerar no Codex ou no ChatGPT.
- Nunca numere slides ("01 / 05"): a plataforma já mostra.

## 4. Render e checagem

1. Salve cada slide em `carrosseis/<id>/v<N>/slide-NN.html` com fontes e imagens resolvendo localmente.
2. Da raiz do projeto: `node <skill>/scripts/render.mjs <id>/v<N> --dir carrosseis` gera `slide-NN.png` (1080×1350) e `slide-NN-2x.png` (2160×2700).
3. **Abra e olhe cada PNG** antes de entregar: texto cortado, sobreposição, texto colado na borda, texto na safe zone da base (últimos 150px, onde ficam os pontinhos do Instagram), contraste, asset pequeno demais. Corrija e renderize de novo. Nunca entregue sem ter olhado.

## 5. Entrega

Siga `references/entrega.md`: registrar em `carrosseis.json` (com legenda), gerar o slider (`build-viewer.mjs`) e a galeria (`build-gallery.mjs`), e mostrar o resultado ao usuário.

## 6. Feedback vira gosto

Toda aprovação, recusa ou ajuste entra no `GOSTO.md` **na mesma rodada** (formato no próprio arquivo). Ao ajustar uma peça, mude **só o que foi pedido**. Revisão de um tema vira nova versão (`v2`, `v3`), nunca sobrescreve a anterior.

## Regras fixas

- Não publicar, agendar ou postar nada. A skill entrega arquivos.
- Não inventar interface de produto: use print real ou o markup do próprio projeto.
- Dados de exemplo são identificados como exemplo.
- Português do usuário na copy; sem jargão que o público da marca não usa.
