import { Global, Module, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { db, pool } from "./database";
import { SCHEMA } from "./schema";

export const DRIZZLE = Symbol("DRIZZLE");

export type Database = ReturnType<typeof drizzle<typeof SCHEMA>>;

@Global()
@Module({
	providers: [
		{
			provide: DRIZZLE,
			useValue: db,
		},
	],
	exports: [DRIZZLE],
})
export class DatabaseModule implements OnModuleDestroy {
	async onModuleDestroy() {
		await pool.end();
	}
}
