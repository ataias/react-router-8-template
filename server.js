import compression from "compression";
import { createServer } from "node:http";
import express from "express";
import morgan from "morgan";

// Shape of ./server/app.ts, which is loaded untyped through Vite or the build output.
/** @typedef {{ app: import("express").RequestHandler }} ServerModule */

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

const app = express();
const server = createServer(app);

app.use(compression());
app.disable("x-powered-by");

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      // Share the HTTP server so HMR uses PORT instead of a separate WebSocket port.
      server: { middlewareMode: true, hmr: { server } },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      /** @type {ServerModule["app"]} */
      const handler = (await viteDevServer.ssrLoadModule("./server/app.ts")).app;
      await handler(req, res, next);
    } catch (error) {
      if (error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");
  app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
  app.use(morgan("tiny"));
  app.use(express.static("build/client", { maxAge: "1h" }));
  app.use(await import(BUILD_PATH).then((/** @type {ServerModule} */ mod) => mod.app));
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
