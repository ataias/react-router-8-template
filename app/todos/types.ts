import { z } from "zod";

export const TodoItemSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title must not be empty"),
  completed: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TodoItem = z.infer<typeof TodoItemSchema>;
