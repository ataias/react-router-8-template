import { text, sqliteTable, int } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos_table", {
  id: text().primaryKey(),
  title: text().notNull(),
  completed: int({ mode: "boolean" }),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});
