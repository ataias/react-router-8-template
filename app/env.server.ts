// Plain Node scripts (seed, drizzle config) import this too, so keep it free of `~/` aliases.
import "dotenv/config";
import { z } from "zod";

export const env = z.object({ DB_FILE_NAME: z.string().min(1) }).parse(process.env);
