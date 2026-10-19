import { useEffect, useId, useRef } from "react";
import { data, Link, useFetcher, useNavigation, useSearchParams } from "react-router";
import { LoaderCircle, Pencil, Trash } from "lucide-react";
import { clsx } from "clsx";
import { z } from "zod";

import type { Route } from "./+types/todos";
import { addTodo, deleteTodo, getTodos, setTodoCompleted } from "~/todos/todos.server";
import type { TodoItem } from "~/todos/types";
import styles from "~/todos/todos.module.css";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Todos" }, { name: "description", content: "Todo App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const hideCompleted = new URL(request.url).searchParams.get("hideCompleted") === "true";
  return { todos: await getTodos({ hideCompleted }), hideCompleted };
}

const ActionSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("add"),
    title: z.string().trim().min(1, "Title is required"),
  }),
  z.object({
    intent: z.literal("toggle"),
    id: z.string().min(1),
    completed: z.stringbool(),
  }),
  z.object({
    intent: z.literal("remove"),
    id: z.string().min(1),
  }),
]);

export async function action({ request }: Route.ActionArgs) {
  const parsed = ActionSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) {
    return data({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;
  switch (input.intent) {
    case "add":
      await addTodo(input.title);
      break;
    case "toggle":
      if (!(await setTodoCompleted(input.id, input.completed))) {
        throw data("Not Found", { status: 404 });
      }
      break;
    case "remove":
      await deleteTodo(input.id);
      break;
  }
  return { error: null };
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Todo List</h1>
      <ul>
        {loaderData.todos.map((todo) => (
          <li key={todo.id} className={styles.todo}>
            <TodoTitle todo={todo} />
            <Link to={`/todos/${todo.id}`} aria-label={`Edit ${todo.title}`}>
              <Pencil size={18} />
            </Link>
            <RemoveTodo todo={todo} />
          </li>
        ))}
      </ul>
      <AddTodo />
      <HideCompleted checked={loaderData.hideCompleted} />
    </main>
  );
}

function TodoTitle({ todo }: { todo: TodoItem }) {
  const fetcher = useFetcher<typeof action>();
  // Show the submitted value until the loader catches up.
  const pending = fetcher.formData?.get("completed");
  const completed = pending == null ? todo.completed : pending === "true";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="toggle" />
      <input type="hidden" name="id" value={todo.id} />
      <input type="hidden" name="completed" value={String(!completed)} />
      <button type="submit" className={clsx(styles.title, completed && styles.completed)}>
        {todo.title}
      </button>
    </fetcher.Form>
  );
}

function RemoveTodo({ todo }: { todo: TodoItem }) {
  const fetcher = useFetcher<typeof action>();
  const pending = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="remove" />
      <input type="hidden" name="id" value={todo.id} />
      <button type="submit" className={styles.title}>
        {pending ? <LoaderCircle size={18} /> : <Trash className={styles.error} size={18} />}
      </button>
    </fetcher.Form>
  );
}
function AddTodo() {
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const error = fetcher.data?.error;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error === null) {
      formRef.current?.reset();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form ref={formRef} method="post">
      <input type="hidden" name="intent" value="add" />
      <input type="text" name="title" aria-label="Title" aria-invalid={error ? true : undefined} />
      <p className={styles.error} aria-live="polite">
        {error}
      </p>
      <button type="submit" aria-busy={fetcher.state !== "idle"}>
        Add
      </button>
    </fetcher.Form>
  );
}

function HideCompleted({ checked }: { checked: boolean }) {
  const id = useId();
  const [, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  // Reflect the pending navigation so the checkbox flips before the loader finishes.
  const optimisticChecked = navigation.location
    ? new URLSearchParams(navigation.location.search).get("hideCompleted") === "true"
    : checked;

  return (
    <div className={styles.todo}>
      <label htmlFor={id}>Hide completed</label>
      <input
        id={id}
        type="checkbox"
        checked={optimisticChecked}
        onChange={(e) => {
          setSearchParams(e.target.checked ? { hideCompleted: "true" } : {}, {
            replace: true,
            preventScrollReset: true,
          });
        }}
      />
    </div>
  );
}
