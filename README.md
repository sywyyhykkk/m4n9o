# M4N9O

M4N9O is a minimal personal terminal for the web.

## Setup

Use Node.js 24 LTS and pnpm.

```bash
pnpm install
cp .env.example .env
```

The terminal version is controlled by `NUXT_PUBLIC_APP_VERSION` in `.env`.

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
