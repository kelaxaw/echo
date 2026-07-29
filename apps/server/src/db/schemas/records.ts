import { pgTable, serial } from "drizzle-orm/pg-core";

export const recordsTable = pgTable("records", {
  id: serial("id").primaryKey(),
});
