# Meeting BaaS Frontend v2

Web dashboard for [Meeting BaaS](https://meetingbaas.com): manage meeting bots, real-time transcription, and analytics across **Google Meet**, **Microsoft Teams**, and **Zoom**.

## Tech stack

- **Next.js 15** (App Router) with **Turbopack**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** (primitives), **shadcn/ui**-style components
- **Better Auth** for sign-in/sign-up/session
- **TanStack Query** (React Query) for server state
- **React Hook Form** + **Zod** for forms and validation
- **Vitest** + **Testing Library** for tests
- **Biome** for lint and format

## Prerequisites

- **Node.js** ≥ 22.16.0 (see root monorepo `engines`)
- **pnpm** ≥ 10.18.3

## Setup

1. **Install dependencies** (from repo root or this app):

   ```bash
   pnpm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and set:

   | Variable | Description |
   | ---------- | ------------- |
   | `NEXT_PUBLIC_FRONTEND_BASEURL` | Public URL of this app (e.g. `http://localhost:3000`) |
   | `NEXT_PUBLIC_API_SERVER_BASEURL` | Meeting BaaS API base URL (e.g. `http://localhost:3001`) |
   | `IMAGE_HOST` | Allowed image host for Next.js (e.g. `*.s3.fr-par.scw.cloud` for S3 artifacts) |
   | `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email shown on error pages |

   For self-hosted deployments you can use `.env.self-host` as a reference.

3. **Run in development**

   ```bash
   pnpm dev
   ```

   App runs at [http://localhost:3000](http://localhost:3000) (or the port you set). Home redirects to `/bots`.

## Scripts

| Command | Description |
| --------- | ------------- |
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build (Turbopack) |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome check |
| `pnpm format` | Run Biome format |
| `pnpm test` | Run Vitest (watch) |
| `pnpm test:run` | Run Vitest once |
| `pnpm test:coverage` | Run Vitest with coverage |

## Project structure

```text
app/
  (auth)/          # Sign-in, sign-up, forgot/reset password, verify email
  (home)/          # Authenticated dashboard (layout with sidebar)
    bots/          # Bot list & details
    scheduled-bots/
    credentials/   # Zoom (and other) credentials
    alerts/        # Alert rules, history, email preferences
    api-keys/
    webhooks/
    calendars/
    logs/
    analytics/
    account/       # Account & billing
    settings/
    admin/         # Admin: teams, users, bots, support
  (utility)/       # Unsubscribe, viewer, team creation, bot logs, etc.
components/        # Feature-specific and shared UI (layout, header, ui)
lib/               # API client, auth, routes, schemas, helpers
hooks/
contexts/
types/
```

- **API calls**: `lib/api-client.ts` and `lib/api-routes.ts` (BFF-style calls to the Meeting BaaS API).
- **Auth**: `lib/auth-client.ts` (Better Auth); session is validated in the home layout and used for sidebar/team context.
- **Env**: `env.js` uses `@t3-oss/env-nextjs` for typed, validated env (client-side `NEXT_PUBLIC_*` only in this app).

## Main features

- **Bots** – Create and manage one-off meeting bots (Zoom, Meet, Teams).
- **Scheduled bots** – Schedule bots by date/time.
- **Credentials** – Manage Zoom credentials (OBF, SDK, user-authorized).
- **Alerts** – Alert rules, history, and email preferences (e.g. usage limits, bot failures).
- **API keys** – Create and manage API keys for the Meeting BaaS API.
- **Webhooks** – Configure and inspect webhooks.
- **Calendars** – Calendar-based bot scheduling.
- **Logs & analytics** – Bot logs and usage analytics.
- **Account & settings** – Billing, team, and app settings.
- **Admin** – Team, user, and support management (admin-only).

## Security

- **Security headers** are set in `next.config.ts`: XSS protection, nosniff, frame options, HSTS, referrer policy, permissions policy.
- **Image loading** is restricted via `IMAGE_HOST` (remote patterns for Next.js Image).
- **Auth** is handled by Better Auth with session cookies; API requests use the same cookie/session where applicable.

## Deployment

- **Standalone output**: set `STANDALONE=true` so Next.js builds a standalone bundle (useful for Docker).
- **Image host**: ensure `IMAGE_HOST` matches your artifact storage domain (e.g. S3) so recording/artifact images load correctly.

## Monorepo note

This app lives in the `meeting-baas-v2` monorepo as the `apps/frontend` submodule (or in-repo app). Install and run from the repo root with `pnpm` workspace commands if needed (e.g. `pnpm --filter meeting-baas-frontend-v2 dev`).
