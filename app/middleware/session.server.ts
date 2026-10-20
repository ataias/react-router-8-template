import type { MiddlewareFunction } from "react-router";
import { sessionContext } from "~/context.server";
import { commitSession, getSession } from "~/sessions.server";

export const sessionMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const session = await getSession(request.headers.get("Cookie"));
  context.set(sessionContext, session);
  const response = await next();
  response.headers.append("Set-Cookie", await commitSession(session));
  return response;
};
