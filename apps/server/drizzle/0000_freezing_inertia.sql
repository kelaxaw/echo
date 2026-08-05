CREATE TYPE "public"."job_status" AS ENUM('idle', 'pending', 'finished', 'failed');--> statement-breakpoint
CREATE TABLE "recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reflection_id" uuid NOT NULL,
	"s3_key" text NOT NULL,
	"duration_ms" integer NOT NULL,
	"mime_type" text,
	"transcription_model" text,
	"transcriptStatus" "job_status" DEFAULT 'idle' NOT NULL,
	"uploadStatus" "job_status" DEFAULT 'idle' NOT NULL,
	"language" text,
	"content" text,
	"transcriptError" text,
	"transcript_attempts" smallint DEFAULT 0 NOT NULL,
	"recordedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reflection_id" uuid NOT NULL,
	"title" text,
	"summary" text,
	"dayScore" smallint,
	"mood" smallint,
	"focus" smallint,
	"drift" smallint,
	"productivity" smallint,
	"procrastination" smallint,
	"energy" smallint,
	"events" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"emotions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_url" text,
	"imageGenStatus" "job_status" DEFAULT 'idle' NOT NULL,
	"image_error" text,
	"image_gen_prompt_version" text,
	"image_gen_provider" text,
	"llm_provider" text,
	"llm_prompt_version" text
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"telegram_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_telegram_id_unique" UNIQUE("telegram_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_reflection_id_reflections_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reflection_id_reflections_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "recording_reflection_uq" ON "recordings" USING btree ("reflection_id");--> statement-breakpoint
CREATE INDEX "recording_reflection_recorded_idx" ON "recordings" USING btree ("reflection_id","recordedAt");--> statement-breakpoint
CREATE INDEX "recording_transcript_status_idx" ON "recordings" USING btree ("transcriptStatus") WHERE "recordings"."transcriptStatus" in ('idle', 'pending', 'failed');--> statement-breakpoint
CREATE UNIQUE INDEX "reflection_user_date_uq" ON "reflections" USING btree ("user_id","date" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "report_reflection_uq" ON "reports" USING btree ("reflection_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");