# WhatsApp Status Optimize

Prepare photos and videos for WhatsApp Status so they keep looking sharp after WhatsApp processes them.

This does **not** prevent WhatsApp compression. It prepares Status-friendly media before you post.

**Upload → WhatsApp-ready photo or video → Share (or Download).**

## Architecture

```
apps/web                   Next.js — photos optimized in the browser (Canvas)
PeaceEgo/whatsapp-status-api   Separate repo — videos optimized with native ffmpeg
```

- **Photos:** stay on the device (no upload).
- **Videos:** sent to the video API, encoded, returned, not retained.

Usage tracking: **Vercel Analytics** (`hd_optimize`, `video_optimize`, `share_whatsapp`, `download`).

## Develop (web)

```bash
npm install
npm run dev          # http://localhost:3000
```

For video, run the [whatsapp-status-api](https://github.com/PeaceEgo/whatsapp-status-api) locally and set `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
```

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Privacy

Photos never leave the browser. Videos are sent to the API solely to prepare a Status-ready file and are not retained after the response.

## Deploy

- **Web:** Vercel with Root Directory `apps/web`. Set `NEXT_PUBLIC_API_URL` to your API origin.
- **API:** Deploy the separate `whatsapp-status-api` repo (Railway / Render / Fly / VPS). Set `FRONTEND_ORIGIN` to your Vercel URL.

```bash
npx vercel --cwd apps/web
```
