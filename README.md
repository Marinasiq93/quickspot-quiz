# Quickspot Quiz

Quiz interativo de captura de leads para a Quickspot, usado em eventos presenciais. Inclui:

- Página pública do quiz (formulário de lead + perguntas com cronômetro regressivo por pergunta)
- Painel administrativo (senha compartilhada) para gerenciar perguntas e exportar participantes
- Ranking ao vivo (top 4) atualizado em tempo real via Supabase Realtime

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres + Realtime).

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Rode [`supabase/schema.sql`](supabase/schema.sql) uma vez no SQL Editor do seu projeto Supabase. As tabelas são prefixadas com `quiz_` para não colidir com outras tabelas do mesmo projeto.

3. Copie `.env.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — em Project Settings → API no painel do Supabase.
   - `ADMIN_PASSWORD` — senha de acesso ao `/admin`.
   - `ADMIN_SESSION_SECRET` — string aleatória (`openssl rand -base64 32`).

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   - Quiz público: [http://localhost:3000](http://localhost:3000)
   - Painel admin: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Ranking ao vivo: [http://localhost:3000/ranking](http://localhost:3000/ranking)

## Como funciona a pontuação

Cada pergunta tem um cronômetro regressivo (padrão configurável em `DEFAULT_TIME_LIMIT_SECONDS`, ou por pergunta no admin). Resposta correta vale 100 pontos base + até 50 pontos de bônus por velocidade, proporcional ao tempo restante. Resposta errada ou tempo esgotado vale 0. A pontuação é sempre calculada e validada no servidor (`src/lib/scoring.ts`), nunca confiando no cliente.

## Deploy

Este projeto é feito para deploy na Vercel como um projeto independente — basta apontar as mesmas variáveis de ambiente do Supabase. Lembre-se de configurar todas as variáveis de `.env.example` nas configurações do projeto na Vercel antes do primeiro deploy.
