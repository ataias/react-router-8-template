import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("todos", [index("routes/todos.tsx"), route(":id", "routes/todo.tsx")]),
  route("/error", "routes/error.tsx"),
] satisfies RouteConfig;
