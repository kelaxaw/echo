import { relations } from "drizzle-orm";
import {
	jsonb,
	pgTable,
	smallint,
	text,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { jobStatus } from "./enums";
import { reflectionsTable } from "./reflections";

type ReportEvent = {
	text: string;
};

export const reportsTable = pgTable(
	"reports",
	{
		id: uuid().defaultRandom().primaryKey(),

		reflectionId: text("reflection_id")
			.notNull()
			.references(() => reflectionsTable.id, { onDelete: "cascade" }),

		title: text("title"),

		summary: text("summary"),

		dayScore: smallint("dayScore"),

		mood: smallint("mood"),

		focus: smallint("focus"),

		drift: smallint("drift"),

		productivity: smallint("productivity"),

		procrastination: smallint("procrastination"),

		energy: smallint("energy"),

		events: jsonb("events").$type<ReportEvent[]>().default([]).notNull(),

		emotions: jsonb("emotions").$type<string[]>().default([]).notNull(),

		imageGenUrl: text("image_url"),

		imageGenStatus: jobStatus().default("idle").notNull(),

		imageGenError: text("image_error"),

		imageGenPromptVersion: text("image_gen_prompt_version"),

		imageGenProvider: text("image_gen_provider"),

		llmProvider: text("llm_provider"),

		llmPromptVersion: text("llm_prompt_version"),
	},
	(t) => [uniqueIndex("report_reflection_uq").on(t.reflectionId)],
);

export const reportRelations = relations(reportsTable, ({ one }) => ({
	reflection: one(reflectionsTable, {
		fields: [reportsTable.reflectionId],
		references: [reflectionsTable.id],
	}),
}));
