import { createRequestHandler } from "@react-router/express";
import express from "express";
import { randomUUID } from "node:crypto";
import { RouterContextProvider } from "react-router";
import { requestInfoContext } from "~/context.server";

export const app = express();

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    async getLoadContext(request: express.Request) {
      const context = new RouterContextProvider();
      context.set(requestInfoContext, {
        requestId: randomUUID(),
        ip: request.ip,
      });
      return context;
    },
  }),
);
