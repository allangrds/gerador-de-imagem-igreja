# Onboarding: marca que já existe

Objetivo: transformar o que a marca já tem em `marca.json`, `manual.md` e as primeiras regras do `GOSTO.md`, sem reinventar a identidade.

## 1. Pedir o material (de uma vez)
- Site ou landing page (URL ou pasta do projeto).
- Logo (SVG de preferência) e arquivos de fonte, se tiver.
- 3 a 6 posts que a pessoa considera bons, e 1 ou 2 que não gosta.
- Guia de marca, se existir.

Se o projeto for o próprio site da marca, leia o CSS: cores, fonte, raios e sombras reais valem mais que qualquer suposição.

## 2. Extrair
- **Cores:** primária, texto, texto suave, fundo e 1 ou 2 de apoio, em hex. Confira o contraste do texto sobre o fundo.
- **Fonte:** família e pesos usados. Três jeitos, em `marca.json > fonte`: `arquivos` com woff2 locais em `marca/fontes/` (ex.: `{"500": "fontes/marca-500.woff2"}`); `css` com a URL de um CSS de fonte web (Fontshare, Adobe Fonts); ou só `familia`, que cai no Google Fonts.
- **Elementos:** estilo dos cards, sombras, formas e ícones que se repetem.
- **Tom:** como a marca escreve (curto/longo, formal/informal, usa humor?).

## 3. Confirmar antes de gravar
Mostre um resumo em 6 a 8 linhas (cores, fonte, tom, 3 coisas que a marca sempre faz, 3 que nunca faz) e pergunte o que está errado. Só então grave `marca.json` e `manual.md`.

## 4. Referências e gosto
- Posts bons: registre em `GOSTO.md` > Funciona, com o motivo.
- Posts ruins: registre em Nunca/Sempre o que os torna ruins.
- Se os posts bons forem do próprio usuário, ofereça cadastrá-los na galeria como versão de referência.

## 5. Assets
Veja se a marca já tem uma biblioteca de imagens consistente. Se não tiver, proponha criar a primeira série (`image-gen.md`).
