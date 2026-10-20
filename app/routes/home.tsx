import { data, Form, Link, useLoaderData, useSubmit } from "react-router";

import type { Route } from "./+types/home";
import { useId } from "react";
import { z } from "zod";
import { requestInfoContext, sessionContext } from "~/context.server";
import { commitSession } from "~/sessions.server";
import { sessionMiddleware } from "~/middleware/session.server";

export const middleware: Route.MiddlewareFunction[] = [sessionMiddleware];

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "React Router 8 Template" },
    { name: "description", content: "React Router + Drizzle/SQLite + Pico CSS starter" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const { requestId, ip } = context.get(requestInfoContext);
  console.log(`[${requestId}] home loader from ${ip}`);
  const session = context.get(sessionContext);
  return {
    allowTracking: session.get("allowTracking"),
  };
}

const ActionSchema = z.object({
  allowTracking: z.literal("on").optional().transform(Boolean),
});

export async function action({ request, context }: Route.ActionArgs) {
  const rawData = await request.formData();
  const formData = ActionSchema.parse(Object.fromEntries(rawData));
  const session = context.get(sessionContext);
  session.set("allowTracking", formData.allowTracking);
  await commitSession(session);

  return data({ success: true }, { headers: { "Set-Cookie": await commitSession(session) } });
}

export default function Home() {
  return (
    <main>
      <h1>React Router 8 Template</h1>
      <h2>Examples</h2>
      <ul>
        <li>
          <Link to="/todos">Todos</Link>: add, edit and toggle todos with loaders, actions and
          Drizzle
        </li>
      </ul>
      <AllowTracking />
    </main>
  );
}

function AllowTracking() {
  const id = useId();
  const submit = useSubmit();
  const { allowTracking } = useLoaderData<typeof loader>();
  return (
    <Form
      method="post"
      onChange={async (event) => {
        await submit(event.currentTarget);
      }}
    >
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        <label htmlFor={id}>Allow Tracking</label>
        <input name="allowTracking" id={id} type="checkbox" defaultChecked={allowTracking} />
      </div>
    </Form>
  );
}
