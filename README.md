# Gemini Liquid Glass Web App

Web app mobile first inspirado na experiência do Gemini, com visual Liquid Glass e chat funcional integrado à Gemini API por uma rota server-side do Next.js.

O objetivo do projeto é entregar uma interface polida para teste técnico: responsiva, acessível, com arquitetura simples, tokens visuais consistentes e sem exposição de chaves no client.

## Stack

- Next.js com App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Tailwind Variants
- Tailwind Merge
- Lucide React
- Vercel AI SDK
- Google Gemini API via `@ai-sdk/google`
- Zod para validação do payload da API

## Como Rodar Localmente

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente local a partir do exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env.local
```

Preencha a variável no `.env.local`:

```txt
GOOGLE_GENERATIVE_AI_API_KEY=
```

Substitua o valor vazio pela sua chave gerada no Google AI Studio.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Sim | Chave da Google AI Studio usada somente na rota server-side `src/app/api/chat/route.ts`. |

O arquivo `.env.example` não contém valores reais. Nunca coloque a chave diretamente em componentes client-side.

## Integração com IA

O chat envia mensagens para `src/app/api/chat/route.ts`, que roda no servidor. A rota valida o payload com Zod, verifica se `GOOGLE_GENERATIVE_AI_API_KEY` está configurada e usa o Vercel AI SDK para gerar resposta em streaming.

O modelo configurado em `src/lib/ai.ts` é:

```txt
gemini-2.5-flash
```

O prompt de sistema orienta o assistente a responder em português do Brasil por padrão. Quando a chave está ausente ou a API falha, a UI exibe uma mensagem amigável e opção de tentar novamente.

## Decisões de Design

- A UI é original, mas inspirada em padrões de interação do Gemini.
- O visual Liquid Glass usa superfícies translúcidas, blur, brilho interno, sombras suaves e gradientes ambientais.
- Os componentes reutilizáveis usam `data-slot`, `tailwind-variants` e `tailwind-merge`.
- Botões de ícone possuem `aria-label`.
- Estados de vazio, loading, erro e conversa foram implementados.
- Animações são sutis e respeitam `prefers-reduced-motion`.

## Estratégia Responsiva

A implementação é mobile first.

- De `0px` até `959px`, a experiência mantém a composição mobile/tablet com header superior, drawer lateral e composer fixo no rodapé.
- A partir de `960px`, o breakpoint customizado `desktop` ativa uma sidebar persistente, desloca o conteúdo principal e centraliza o composer em uma largura confortável.
- A aplicação não usa `max-w-[959px]` como limite global.
- Larguras máximas aparecem apenas em regiões internas, como conteúdo principal e composer, para preservar legibilidade.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Observação: não há script `typecheck` separado neste momento; a checagem TypeScript roda durante `npm run build`.

## Checklist de Features

- [x] Shell principal mobile first
- [x] Header inspirado no Gemini
- [x] Drawer lateral com fechamento por Escape e clique fora
- [x] Cards de sugestões
- [x] Composer fixo no rodapé
- [x] Estado vazio
- [x] Estado de conversa
- [x] Estado de loading
- [x] Estado de erro com retry
- [x] Chat server-side com Gemini API
- [x] Streaming de resposta quando disponível
- [x] `.env.example` sem segredo real
- [x] Breakpoint desktop em `960px`
- [x] Polimento visual Liquid Glass
- [x] Revisão de acessibilidade e responsividade nos tamanhos principais

## Validação Recomendada

Antes de entregar ou fazer deploy, rode:

```bash
npm run lint
npm run build
```

Também vale revisar manualmente as larguras:

```txt
360px, 375px, 430px, 768px, 959px, 960px, 1280px
```

Verifique se não há overflow horizontal, se o composer permanece visível, se o foco é perceptível via teclado e se o drawer mantém navegação acessível.
