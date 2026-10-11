// src/entry-server.tsx
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./AppRoutes";

export function render(url: string) {
  const helmetContext: any = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  const helmet = helmetContext.helmet;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${helmet?.title?.toString?.() ?? ""}
    ${helmet?.meta?.toString?.() ?? ""}
    ${helmet?.link?.toString?.() ?? ""}
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/assets/index.js"></script>
  </body>
</html>`;
}