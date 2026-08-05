import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { db } from "../db/database";
import * as authSchema from "./auth.schema";
import { telegramPlugin } from "./telegram-plugin";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
     enabled: true,
   },
  user: {
    additionalFields: {
      telegramId: {
        type: "string",
        required: false,
        input: false, // set server-side only, never from client body
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  trustedOrigins: ["echo://", "exp://"],
  plugins: [bearer(), telegramPlugin()]
});
