# M4N9O

M4N9O is a minimal personal terminal for the web.

## Setup

Use Node.js 24 LTS and pnpm.

```bash
pnpm install
cp .env.example .env
```

The terminal version is controlled by `NUXT_PUBLIC_APP_VERSION` in `.env`.

## UIgly gallery

`/project/uigly` displays templates from the separate [UIgly repository](https://github.com/sywyyhykkk/uigly). Before development or a production build, `scripts/sync-uigly.mjs` reads the approved catalog and standalone HTML files from `uigly/main` into an ignored local server route. The gallery previews each file in a sandboxed iframe and shows its source.

Merging a UIgly pull request triggers the M4N9O Vercel Deploy Hook through the UIgly repository's `M4N9O_DEPLOY_HOOK` Actions secret. A successful M4N9O build publishes the refreshed gallery.

## Clipboard lab

`/c` saves text to one shared clipboard, `/c/<url-encoded text>` saves the path text when opened in a browser, and `/p` reads it and attempts to copy it. The text expires 10 minutes after each save. Browser clipboard restrictions may require pressing the visible Copy button.

The Nuxt API forwards requests to the small Python service in `deploy/clipboard-service.py`. Set `NUXT_CLIPBOARD_SERVICE_URL` and `NUXT_CLIPBOARD_SERVICE_TOKEN` on the Nuxt server; set the same token as `CLIPBOARD_SERVICE_TOKEN` on the Python service. The service keeps only the latest text in memory and clears it on expiry or restart. The production server runs the included systemd unit and Caddy configuration.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Production preview

```bash
pnpm build
pnpm preview
```
