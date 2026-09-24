# WhatsApp Status Optimize

Prepare photos and videos for WhatsApp Status so they keep looking sharp after WhatsApp processes them.

This does **not** prevent WhatsApp compression. It prepares Status-friendly media before you post.

**Upload → WhatsApp-ready photo or video → Share (or Download).**

## Features

- Photo optimization for WhatsApp Status
- Video optimization
- WhatsApp HD image preparation
- Responsive interface for desktop and mobile
- Share optimized media directly to WhatsApp when supported
- Download optimized media
- Privacy-focused processing
- Usage analytics

## Tech Stack

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS

### Media Processing

- HTML Canvas API for image processing (in the browser)
- Native FFmpeg for video processing (separate API)

### Analytics

- Vercel Analytics (`hd_optimize`, `video_optimize`, `share_whatsapp`, `download`)

### Deployment

- Web: Vercel
- Video API: separate [whatsapp-status-api](https://github.com/PeaceEgo/whatsapp-status-api) repo

## Architecture

Photos stay on the device. Videos are sent to the video API, encoded, returned, and not retained.

```text
User
  │
  ▼
Next.js Web App
  │
  ├── Photos ──► Canvas API ──► Optimized Image
  │
  └── Videos ──► whatsapp-status-api (ffmpeg) ──► Optimized Video
                         │
                         ▼
                 Share / Download
```

```text
apps/web                        Next.js — photos optimized in the browser (Canvas)
PeaceEgo/whatsapp-status-api    Separate repo — videos optimized with native ffmpeg
```

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
