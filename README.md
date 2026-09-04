# WhatsApp Status Optimize

Prepare photos for WhatsApp Status so they keep looking sharp after WhatsApp processes them.

This does **not** prevent WhatsApp compression. It resizes and encodes images in the browser so they fit Status more cleanly.

**Upload → WhatsApp HD → Share (or Download).**

## Architecture

Images and videos never leave the device. There is no database, auth, or media upload API.

```
apps/web   Next.js app — Canvas photo HD + client FFmpeg video
apps/api   Hono stub — health check only, not used by the media flow
```

Usage (visitors + events) is tracked with **Vercel Analytics**. Enable Web Analytics on the Vercel project, then open the Analytics tab for visitor counts and custom events (`hd_optimize`, `video_optimize`, `share_whatsapp`, `download`).

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

`apps/web/vercel.json` installs from the monorepo root so Linux native Tailwind/`lightningcss` binaries resolve on Vercel.

```bash
npx vercel --cwd apps/web
```

The API is a placeholder for later. It is not required for the MVP.
