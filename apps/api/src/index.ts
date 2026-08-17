import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const PORT = Number(process.env.PORT ?? 8787);
const VERSION = "0.1.0";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.FRONTEND_ORIGIN ? [process.env.FRONTEND_ORIGIN] : []),
];

const app = new Hono();

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "HEAD", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

app.get("/v1", (c) =>
  c.json({
    service: "whatsapp-status-optimize-api",
    version: VERSION,
    note: "Image processing is client-side. Do not send photos here.",
  }),
);

app.post("*", (c) =>
  c.json(
    {
      error:
        "This API does not accept file uploads. Image processing happens in the browser.",
    },
    405,
  ),
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`API stub listening on http://localhost:${info.port}`);
});
