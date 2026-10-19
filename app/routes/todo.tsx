import { useId } from "react";
import { data, Form, Link, useNavigation } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/todo";
import { getTodo, updateTodo } from "~/todos/todos.server";

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Todo - ${loaderData?.todo.title ?? "Not Found"}` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const todo = await getTodo(params.id);
  if (!todo) {
    throw data("Not Found", { status: 404 });
  }
  return { todo };
}

const UpdateTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  // Unchecked checkboxes are left out of the form data.
  completed: z.stringbool().default(false),
});

export async function action({ params, request }: Route.ActionArgs) {
  const parsed = UpdateTodoSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) {
    return data(
      { error: parsed.error.issues[0]?.message ?? "Invalid input", savedAt: null },
      { status: 400 },
    );
  }
  const savedAt = await updateTodo(params.id, parsed.data);
  if (savedAt === undefined) {
    throw data("Not Found", { status: 404 });
  }
  return { error: null, savedAt };
}

export default function Todo({ loaderData, actionData }: Route.ComponentProps) {
  const { todo } = loaderData;
  const isSaving = useNavigation().state === "submitting";
  const error = actionData?.error;

  return (
    <main>
      <p>
        <Link to="/todos">← Todos</Link>
      </p>
      <h1>Todo</h1>
      <Form method="post">
        <Row label="ID" inputProps={{ type: "text", value: todo.id, readOnly: true }} />
        <Row
          label="Title"
          inputProps={{
            type: "text",
            name: "title",
            defaultValue: todo.title,
            "aria-invalid": error ? true : undefined,
          }}
        />
        {error ? <small>{error}</small> : undefined}
        <Row
          label="Completed"
          inputProps={{ type: "checkbox", name: "completed", defaultChecked: todo.completed }}
        />
        <button type="submit" aria-busy={isSaving}>
          {isSaving ? "Saving" : "Save"}
        </button>
        {actionData?.savedAt != null && !isSaving ? (
          <p aria-live="polite">Saved at {new Date(actionData.savedAt).toLocaleTimeString()}</p>
        ) : undefined}
      </Form>
    </main>
  );
}

function Row({
  label,
  inputProps,
}: Readonly<{ label: string; inputProps: React.ComponentProps<"input"> }>) {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input {...inputProps} id={id} />
    </>
  );
}
