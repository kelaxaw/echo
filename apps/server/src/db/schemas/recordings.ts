import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	smallint,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { jobStatus } from "./enums";
import { reflectionsTable } from "./reflections";

export const recordingsTable = pgTable(
	"recordings",
	{
		id: uuid().defaultRandom().primaryKey(),

		reflectionId: text("reflection_id")
			.notNull()
			.references(() => reflectionsTable.id, { onDelete: "cascade" }),

		s3Key: text("s3_key").notNull(),

		durationMs: integer("duration_ms").notNull(),

		mimeType: text("mime_type"),

		transcriptModel: text("transcription_model"),

		transcriptStatus: jobStatus().default("idle").notNull(),

		uploadStatus: jobStatus().default("idle").notNull(),

		language: text("language"),

		content: text("content"),

		transcriptError: text("transcriptError"),

		transcriptAttempts: smallint("transcript_attempts").default(0).notNull(),

		recordedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [
		uniqueIndex("recording_reflection_uq").on(t.reflectionId),
		index("recording_reflection_recorded_idx").on(t.reflectionId, t.recordedAt),
		index("recording_transcript_status_idx")
			.on(t.transcriptStatus)
			.where(sql`${t.transcriptStatus} in ('idle', 'pending', 'failed')`),
	],
);

export const recordingRelations = relations(recordingsTable, ({ one }) => ({
	reflection: one(reflectionsTable, {
		fields: [recordingsTable.reflectionId],
		references: [reflectionsTable.id],
	}),
}));
