import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (BACKEND_TARGET has no VITE_ prefix so we pass "")
  const env = loadEnv(mode, process.cwd(), "");
  // Default to local backend; dev:develop overrides via BACKEND_TARGET in .env.develop
  const backendTarget = env.BACKEND_TARGET || "http://localhost:3001";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: backendTarget.startsWith("https"),
        },
        "/socket.io": {
          target: backendTarget,
          changeOrigin: true,
          secure: backendTarget.startsWith("https"),
          ws: true,
        },
      },
    },
  };
});
