# Banglar Darpan LIVE

Banglar Darpan LIVE is a premium Bengali broadcast experience that lets viewers watch six official YouTube live channels, switch signals, and open a first-visit network promo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/banglar-darpan-live run dev` — run the live broadcast web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- API: Express 5 (shared workspace service, not required by v1)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/banglar-darpan-live/src/App.tsx` — broadcast shell, channel configuration, player, promo, EPG, ticker, and interaction state
- `artifacts/banglar-darpan-live/src/index.css` — broadcast theme, responsive layout, motion, and reduced-motion rules
- `artifacts/banglar-darpan-live/index.html` — Bengali document metadata, font loading, and social metadata
- `artifacts/banglar-darpan-live/public/favicon.svg` — matching broadcast mark
- `lib/api-spec/openapi.yaml` — shared API contract; unchanged because the first version is static-first

## Architecture decisions

- v1 does not use a database or API; public YouTube IDs are application configuration and promo dismissal is local storage.
- Only the selected live channel is mounted, and the live iframe is suspended while the welcome promo is open.
- EPG labels intentionally stay neutral (`LIVE BROADCAST`, `Now Playing`, `Upcoming`) until real schedule data exists.
- The app uses the official YouTube embed and postMessage player commands instead of proxying or re-streaming video.

## Product

- View the active Banglar Darpan LIVE signal.
- Switch between six exact official channels through a desktop guide or mobile rail.
- See broadcast status, a contained ticker, neutral EPG state, player controls, and a first-visit promo.
- Reset the promo dismissal state from the footer for development and testing.

## User preferences

- Keep the visitor-facing identity as Banglar Darpan LIVE, not UKSAI.
- Prefer free-tier, low-complexity infrastructure until persistent data is genuinely needed.

## Gotchas

- Build commands that load Vite directly need `PORT` and `BASE_PATH`; managed workflows provide them automatically.
- Do not add fabricated programme names or headlines when real broadcast data is unavailable.
- The browser may block autoplay; the promo and player must continue working with muted embeds and explicit controls.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
