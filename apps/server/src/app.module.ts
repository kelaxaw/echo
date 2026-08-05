import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth/auth";
import { BotModule } from "./bot/bot.module";
import { DatabaseModule } from "./db/database.module";
import { RecordingsModule } from "./recordings/recordings.module";
import { UsersModule } from "./users/users.module";
import { TranscriptionModule } from './transcription/transcription.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule.forRoot({ auth }),
		UsersModule,
		RecordingsModule,
		BotModule,
		TranscriptionModule,
	],
})
export class AppModule {}
