import { Link } from "react-router";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "React Router 8 Template" },
    { name: "description", content: "React Router + Drizzle/SQLite + Pico CSS starter" },
  ];
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
    </main>
  );
}
