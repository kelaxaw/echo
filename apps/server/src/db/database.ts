import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "../auth/auth.schema";
import * as recordsSchema from "./schemas/recordings";
import * as reflectionsSchema from "./schemas/reflections";
import * as reportsSchema from "./schemas/reports";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is undefined");

const schema = {
	...recordsSchema,
	...reflectionsSchema,
	...reportsSchema,
	...authSchema,
};

export const db = drizzle(databaseUrl, { schema });
