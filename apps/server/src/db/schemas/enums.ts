import { pgEnum } from "drizzle-orm/pg-core";

export const jobStatus = pgEnum("job_status", [
	"idle",
	"pending",
	"finished",
	"failed",
]);
