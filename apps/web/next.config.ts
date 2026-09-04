import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 defaults to Turbopack; empty config acknowledges browser-only FFmpeg WASM.
  turbopack: {},
};

export default nextConfig;
