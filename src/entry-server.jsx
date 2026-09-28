// Build-time renderer used by scripts/prerender.mjs. Never shipped to the browser.
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Writable } from "node:stream";
import { AppRoutes } from "./App";
import { getSeo, renderHead, routes } from "./seo";

export { routes };
export { profile } from "./data/profile";

/** Renders one URL to { html, head }, waiting for lazy routes to resolve. */
export function render(url) {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, done) {
        html += chunk;
        done();
      },
    });
    sink.on("finish", () => resolve({ html, head: renderHead(getSeo(url)) }));

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady: () => pipe(sink),
        onShellError: reject,
        onError: reject,
      }
    );
  });
}
