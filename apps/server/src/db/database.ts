import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from '../auth/auth.schema'
import * as recordsSchema from "./schemas/records";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is undefined");

const schema = { ...recordsSchema, ...authSchema };


export const db = drizzle(databaseUrl, { schema });
