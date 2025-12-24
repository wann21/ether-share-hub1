import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import os from "os";
import { componentTagger } from "lovable-tagger";

// Determine a LAN host for HMR so the browser does not try to connect to 0.0.0.0
const getLanHost = () => {
  const envHost = process.env.VITE_LAN_HOST || process.env.LAN_HOST || process.env.HOST;
  if (envHost) return envHost;
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const addrs = nets[name] || [];
    for (const addr of addrs) {
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return "localhost";
};

const lanHost = getLanHost();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      host: lanHost,
      protocol: "ws",
      port: 8080,
    },
    headers: {
      // Dev-only CSP to allow eval/inline for VM/LAN usage
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data: blob:; connect-src * data: blob:;"
    },
  },
  preview: {
    host: "::",
    port: 8080,
    hmr: {
      host: lanHost,
      protocol: "ws",
      port: 8080,
    },
    headers: {
      // Preview (local-only) CSP relaxation for eval/inline on VM/LAN
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data: blob:; connect-src * data: blob:;"
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
