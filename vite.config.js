import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Serves Netlify Functions that declare `config.path` (e.g. /api/contact) from the Vite dev server,
// so `npm run dev` behaves like production. Netlify runs them itself when deployed.
const FUNCTIONS = { "/api/contact": "/netlify/functions/contact.mjs" };

function netlifyFunctions() {
  return {
    name: "netlify-functions-dev",
    apply: "serve",
    configureServer(server) {
      // Functions read secrets from process.env, as they do on Netlify; load every .env key, not just VITE_ ones.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ""));

      server.middlewares.use(async (req, res, next) => {
        const file = FUNCTIONS[req.url.split("?")[0]];
        if (!file) return next();
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks);
          const request = new Request(new URL(req.url, `http://${req.headers.host}`), { method: req.method, headers: req.headers, body });

          const { default: handler } = await server.ssrLoadModule(file); // Picks up edits without a restart.
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(`[functions] ${file}: ${err.stack ?? err}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Function crashed." }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), netlifyFunctions()],
});
