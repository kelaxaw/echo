import { Module } from "@nestjs/common";
import { storage } from "./storage";

export const STORAGE = Symbol("STORAGE");

@Module({
	providers: [
		{
			provide: STORAGE,
			useValue: storage,
		},
	],
	exports: [STORAGE],
})
export class StorageModule {}
