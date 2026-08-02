import { relations } from "drizzle-orm";
import {
	date,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "src/auth/auth.schema";
import { recordingsTable } from "./recordings";
import { reportsTable } from "./reports";

export const reflectionsTable = pgTable(
	"reflections",
	{
		id: uuid().defaultRandom().primaryKey(),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		date: date("date").notNull(),

		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [uniqueIndex("reflection_user_date_uq").on(t.userId, t.date.desc())],
);

export const reflectionsRelations = relations(
	reflectionsTable,
	({ one, many }) => ({
		user: one(user, {
			fields: [reflectionsTable.userId],
			references: [user.id],
		}),
		recordings: many(recordingsTable),
		report: one(reportsTable),
	}),
);
