// Run with `pnpm db:seed`. Plain Node script, so imports need the `.ts` extension.
import { drizzle } from "drizzle-orm/node-sqlite";
import { reset, seed } from "drizzle-seed";
import { env } from "../env.server.ts";
import { todosTable } from "./schema.ts";

const db = drizzle(env.DB_FILE_NAME);

const titles = [
  "Buy groceries",
  "Call the dentist",
  "Pay the electricity bill",
  "Water the plants",
  "Book flights for the holidays",
  "Renew passport",
  "Clean the garage",
  "Schedule car maintenance",
  "Reply to Sam's email",
  "Pick up dry cleaning",
  "Plan weekend hike",
  "Back up laptop",
  "Read a chapter of a book",
  "Cancel unused subscriptions",
  "Fix the leaky faucet",
];

const now = Temporal.Now.instant();
const daysAgo = (days: number) => now.subtract({ hours: days * 24 }).epochMilliseconds;

await reset(db, { todosTable });
await seed(db, { todosTable }, { count: 12 }).refine((f) => ({
  todosTable: {
    columns: {
      title: f.valuesFromArray({ values: titles, isUnique: true }),
      // Non-overlapping ranges keep updatedAt after createdAt.
      createdAt: f.int({ minValue: daysAgo(30), maxValue: daysAgo(7) }),
      updatedAt: f.int({ minValue: daysAgo(7), maxValue: daysAgo(0) }),
    },
  },
}));
