import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
	Inject,
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Bot } from "grammy";
import { user } from "src/auth/auth.schema";
import { type Database, DRIZZLE } from "src/db/database.module";
import { recordingsTable } from "src/db/schemas/recordings";
import { reflectionsTable } from "src/db/schemas/reflections";
import { STORAGE } from "src/storage/storage.module";
import { auth } from "../auth/auth";

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
	constructor(
		@Inject(STORAGE) private readonly storage: S3Client,
		@Inject(DRIZZLE) private readonly db: Database,
	) {}

	private readonly logger = new Logger(BotService.name);
	private bot: Bot;

	/**
	 * Per-user session tokens, keyed by Telegram id.
	 * MVP: in-memory — lost on restart. Move to DB (or reuse the better-auth
	 * session) once the bot needs to make authed calls across restarts.
	 */
	private readonly tokens = new Map<string, string>();

	onModuleInit() {
		const token = process.env.TELEGRAM_BOT_TOKEN;
		if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

		this.bot = new Bot(token);
		this.registerHandlers();

		// without this grammy rethrows into an unhandled rejection, which kills
		// the whole Nest process on any single failed update.
		this.bot.catch(async ({ error, ctx }) => {
			this.logger.error(
				`Update ${ctx.update.update_id} failed`,
				error instanceof Error ? error.stack : String(error),
			);
			await ctx
				.reply("Что-то пошло не так, попробуй ещё раз позже.")
				.catch(() => {});
		});

		// long polling — fire and forget; bot.start() resolves only on stop
		this.bot.start({
			onStart: (info) => this.logger.log(`Bot @${info.username} started`),
		});
	}

	async onModuleDestroy() {
		await this.bot?.stop();
	}

	private registerHandlers() {
		this.bot.command("start", async (ctx) => {
			const from = ctx.from;
			if (!from) return;

			try {
				// in-process call to the better-auth telegram endpoint.
				// header carries the shared secret the endpoint checks.
				const res = await auth.api.signInTelegram({
					body: {
						telegramId: String(from.id),
						firstName: from.first_name,
						username: from.username,
					},
					headers: {
						"x-telegram-bot-secret": process.env.TELEGRAM_BOT_SECRET ?? "",
					},
				});

				this.tokens.set(String(from.id), res.token);
				await ctx.reply(`Привет, ${from.first_name}! Ты авторизован ✅`);
			} catch (err) {
				this.logger.error("Telegram sign-in failed", err as Error);
				await ctx.reply("Не удалось авторизоваться, попробуй позже.");
			}
		});

		// voice = кружок/голосовое, audio = файл с тегами. Нужны оба.
		this.bot.on(["message:voice", "message:audio"], async (ctx) => {
			const media = ctx.message.voice ?? ctx.message.audio;
			if (!media) return;

			this.logger.log(`Received ${ctx.message.voice ? "voice" : "audio"}`);

			const telegramId = String(ctx.from.id);

			const [account] = await this.db
				.select({ id: user.id })
				.from(user)
				.where(eq(user.telegramId, telegramId));

			if (!account) {
				await ctx.reply("Сначала /start");
				return;
			}

			const file = await ctx.getFile();
			const url = `https://api.telegram.org/file/bot${this.bot.token}/${file.file_path}`;
			const res = await fetch(url);
			const bytes = Buffer.from(await res.arrayBuffer());

			const key = `recordings/${account.id}/${crypto.randomUUID()}.ogg`;

			await this.storage.send(
				new PutObjectCommand({
					Bucket: process.env.STORAGE_BUCKET,
					Key: key,
					Body: bytes,
					ContentType: media.mime_type ?? "audio/ogg",
				}),
			);

			const today = new Date().toISOString().slice(0, 10);

			const [reflection] = await this.db
				.insert(reflectionsTable)
				.values({ userId: account.id, date: today })
				.onConflictDoUpdate({
					target: [reflectionsTable.userId, reflectionsTable.date],
					set: { userId: account.id },
				})
				.returning({ id: reflectionsTable.id });

			await this.db.insert(recordingsTable).values({
				reflectionId: reflection.id,
				s3Key: key,
				durationMs: media.duration * 1000,
				mimeType: media.mime_type ?? "audio/ogg",
				uploadStatus: "finished",
			});
		});
	}

	/** Bearer token for a given Telegram user, if signed in this session. */
	getToken(telegramId: string): string | undefined {
		return this.tokens.get(telegramId);
	}
}
