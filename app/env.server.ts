// Plain Node scripts (seed, drizzle config) import this too, so keep it free of `~/` aliases.
import "dotenv/config";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";

export const env = z.object({ DB_FILE_NAME: z.string().min(1) }).parse(process.env);

// SQLite creates the file but not its parent directory, so make sure it exists.
mkdirSync(dirname(env.DB_FILE_NAME), { recursive: true });
