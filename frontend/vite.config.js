import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
const configDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const backendEnv = loadEnv(
    mode,
    resolve(configDir, "../backend"),
    "FRONTEND_URL",
  );
  const frontendUrl = backendEnv.FRONTEND_URL || "http://localhost:5173";
  const frontendPort = Number(new URL(frontendUrl).port || 5173);

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      strictPort: true,
      proxy: {
        // Proxy API requests to the backend server
        "/api": {
          target: "http://localhost:3001", // Your backend server address
          changeOrigin: true,
        },
      },
    },
  };
});
