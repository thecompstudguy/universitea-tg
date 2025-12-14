# UniversiTEA — Telegram Mini App

![UniversiTEA banner](https://assets.universitea.shop/banner-logo.png)

**UniversiTEA is a Telegram Mini App for student-only, school-scoped anonymous posting and discussion (“tea” / “confessions”) with strong safety, privacy-by-design, and scalable moderation.**

**Author:** The CompSTUD Guy (`the.compstud.guy@universitea.shop`)

This repository contains the **Telegram Mini App (front-end)**. For product goals, safety posture, and architectural decisions, see [`docs/briefs/PROJECT_BRIEF.md`](docs/briefs/PROJECT_BRIEF.md).

> UniversiTEA is designed for *pseudonymity* inside the app, not “perfect” or legally guaranteed anonymity.

## MVP scope (high-level)

- School-scoped feed (latest / trending)
- Anonymous posts + threaded comments
- Invite-based onboarding (student-only boundary)
- Reporting + moderation queue workflows

## Tech stack

- React + TypeScript + Vite
- Telegram Mini Apps SDK: `@tma.js/sdk-react`
- UI kit: `@telegram-apps/telegram-ui`
- Optional: TON Connect via `@tonconnect/ui-react` (included from the starter template)

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- pnpm (required)

> [!IMPORTANT]
> This repo uses `pnpm-lock.yaml`; use pnpm (not npm/yarn) to install and run scripts.

### Install dependencies

```bash
pnpm install
```

### Run locally

Run the dev server (no HTTPS):

```bash
pnpm dev
```

Run the dev server with HTTPS (uses locally generated certificates):

```bash
pnpm dev:https
```

> [!NOTE]
> `pnpm dev:https` uses `vite-plugin-mkcert`. The first launch may request admin permissions to configure local SSL certificates.
> If you don’t need HTTPS, use `pnpm dev`.

#### Telegram environment mocking (local dev)

`src/index.tsx` imports `src/mockEnv.ts` to mock the Telegram WebApp environment in a regular browser.
Be cautious about relying on this outside local development.

> [!WARNING]
> If you use self-signed certificates, the iOS/Android Telegram apps may refuse to load the Mini App.
> See: https://docs.telegram-mini-apps.com/platform/getting-app-link#remote

## Create a bot & register the Mini App

1. Create a Telegram bot via BotFather.
2. Register a Mini App / Web App for the bot and set the URL to your hosted app (or a tunnel).
3. Open the Mini App from Telegram to test with real launch parameters.

Guide: https://docs.telegram-mini-apps.com/platform/creating-new-app

## Scripts

- `dev`: start the dev server
- `dev:https`: start the dev server with HTTPS
- `build`: typecheck + build for production
- `preview`: preview the production build locally
- `lint`: run eslint
- `lint:fix`: run eslint with `--fix`

## TON Connect (optional)

If you keep TON Connect enabled, configure the manifest in `public/`:
https://docs.ton.org/develop/dapps/ton-connect/manifest

## Useful links

- Telegram Mini Apps docs: https://docs.telegram-mini-apps.com/
- `@tma.js/sdk-react` docs: https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react
- TelegramUI: https://github.com/Telegram-Mini-Apps/TelegramUI
