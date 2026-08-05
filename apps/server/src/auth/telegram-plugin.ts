import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";

/**
 * Telegram sign-in plugin.
 *
 * Flow: the bot (trusted, running on our server) already knows the user's
 * identity via `ctx.from.id` from the Telegram API. It calls this endpoint with
 * a shared secret. We find-or-create a `user` and link a `telegram` account, then
 * issue a session token (Bearer) used for all subsequent bot -> server requests.
 *
 * Trust model: the shared secret proves the caller is our bot. `telegramId` is
 * trusted because only the bot (which got it from Telegram) can reach this route.
 * For a browser/app Telegram Login Widget instead, replace the secret check with
 * HMAC-SHA256 verification of Telegram's `initData` using the bot token — see
 * verifyLoginWidget() note at the bottom.
 */
export const telegramPlugin = () => {
	return {
		id: "telegram",
		endpoints: {
			signInTelegram: createAuthEndpoint(
				"/sign-in/telegram",
				{
					method: "POST",
					body: z.object({
						telegramId: z.string().min(1),
						firstName: z.string().min(1),
						username: z.string().optional(),
						photoUrl: z.string().url().optional(),
					}),
				},
				async (ctx) => {
					// 1. verify caller is our bot
					const secret = ctx.headers?.get("x-telegram-bot-secret");

					if (!secret || secret !== process.env.TELEGRAM_BOT_SECRET) {
						throw new APIError("UNAUTHORIZED", {
							message: "Invalid bot secret",
						});
					}

					const { telegramId, firstName, username, photoUrl } = ctx.body;
					const { internalAdapter } = ctx.context;

					// 2. find existing telegram account
					const account = await internalAdapter.findAccountByProviderId(
						telegramId,
						"telegram",
					);
					let user = account
						? await internalAdapter.findUserById(account.userId)
						: null;

					// 3. first login -> create user + link telegram account
					if (!user) {
						user = await internalAdapter.createUser({
							name: firstName,
							// placeholder email: real one can be attached later when the
							// user adds email/password. notNull+unique in schema.
							email: `tg_${telegramId}@placeholder.echo`,
							emailVerified: false,
							image: photoUrl ?? null,
							telegramId,
						});

						await internalAdapter.linkAccount({
							userId: user.id,
							providerId: "telegram",
							accountId: telegramId,
						});
					}

					// 4. issue session
					const session = await internalAdapter.createSession(user.id);
					if (!session) {
						throw new APIError("INTERNAL_SERVER_ERROR", {
							message: "Failed to create session",
						});
					}

					await setSessionCookie(ctx, { session, user });

					return ctx.json({
						token: session.token, // Bearer token for the bot to store per-user
						user,
					});
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
