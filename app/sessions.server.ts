import { createCookieSessionStorage } from "react-router";
import { env } from "./env.server";

export type SessionData = { allowTracking: boolean };

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secrets: [env.SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });
