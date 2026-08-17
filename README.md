# WhatsApp Status Optimize

Prepare photos for WhatsApp Status so they keep looking sharp after WhatsApp processes them.

This does **not** prevent WhatsApp compression. It resizes and encodes images in the browser so they fit Status more cleanly.

**Upload. Optimize. Download. Done.**

## Architecture

Images never leave the device. There is no database, auth, or media upload API.

```
apps/web   Next.js app — the product (Canvas optimizer)
apps/api   Hono stub — health check only, not used by the upload flow
```

## Develop

```bash
npm install
npm run dev          # web at http://localhost:3000
npm run dev:api      # stub at http://localhost:8787
```

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Privacy

Processing is entirely client-side. The API stub must not receive user photos.

## GitHub

This project is a local git repo. Create the GitHub remote when `gh` is available:

```bash
git add .
git commit -m "feat: scaffold status optimize MVP"
gh repo create whatsapp-status-optimize --private --source=. --remote=origin --push
```

## Deploy

Deploy `apps/web` to Vercel. Set the project **Root Directory** to `apps/web`.

```bash
npx vercel --cwd apps/web
```

The API is a placeholder for later. It is not required for the MVP.
