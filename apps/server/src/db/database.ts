import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { SCHEMA } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("DATABASE_URL is undefined");

export const pool = new Pool({
	connectionString: DATABASE_URL,
	statement_timeout: 30_000,
	query_timeout: 30_000,
});

export const db = drizzle(pool, { schema: SCHEMA });
