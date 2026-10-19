import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "~/db/db.server";
import { todosTable } from "~/db/schema";
import { type TodoItem, TodoItemSchema } from "./types";

export async function getTodo(id: string): Promise<TodoItem | undefined> {
  const rows = await db.select().from(todosTable).where(eq(todosTable.id, id));
  return rows[0] && TodoItemSchema.parse(rows[0]);
}

export async function getTodos({
  hideCompleted,
}: Readonly<{ hideCompleted: boolean }>): Promise<TodoItem[]> {
  const rows = await db
    .select()
    .from(todosTable)
    .where(hideCompleted ? eq(todosTable.completed, false) : undefined)
    .orderBy(todosTable.createdAt);
  return rows.map((todo) => TodoItemSchema.parse(todo));
}

export async function addTodo(title: string): Promise<void> {
  const now = Temporal.Now.instant().epochMilliseconds;
  await db
    .insert(todosTable)
    .values({ id: randomUUID(), title, completed: false, createdAt: now, updatedAt: now });
}

export async function deleteTodo(id: string): Promise<void> {
  await db.delete(todosTable).where(eq(todosTable.id, id));
}

/** Returns false when no todo has the given id. */
export async function setTodoCompleted(id: string, completed: boolean): Promise<boolean> {
  const updated = await db
    .update(todosTable)
    .set({ completed })
    .where(eq(todosTable.id, id))
    .returning({ id: todosTable.id });
  return updated.length > 0;
}

/** Returns the update time, or undefined when no todo has the given id. */
export async function updateTodo(
  id: string,
  fields: Readonly<{ title: string; completed: boolean }>,
): Promise<number | undefined> {
  const updatedAt = Temporal.Now.instant().epochMilliseconds;
  const updated = await db
    .update(todosTable)
    .set({ ...fields, updatedAt })
    .where(eq(todosTable.id, id))
    .returning({ id: todosTable.id });
  return updated.length > 0 ? updatedAt : undefined;
}
