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

`/project/uigly` displays templates from the separate [UIgly repository](https://github.com/sywyyhykkk/uigly). Before development or a production build, `scripts/sync-uigly.mjs` reads the approved catalog and standalone HTML files from `uigly/main` into an ignored local JSON file. The gallery previews each file in a sandboxed iframe and shows its source.

Merging a UIgly pull request triggers the M4N9O Vercel Deploy Hook through the UIgly repository's `M4N9O_DEPLOY_HOOK` Actions secret. A successful M4N9O build publishes the refreshed gallery.

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
