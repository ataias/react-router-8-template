import { createContext, type Session } from "react-router";
import { type SessionData } from "./sessions.server";

export const sessionContext = createContext<Session<SessionData>>();
export const requestInfoContext = createContext<{
  requestId: string;
  ip: string | undefined;
}>();
