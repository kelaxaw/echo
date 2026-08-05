import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { auth } from "src/auth/auth";
import { user } from "src/auth/auth.schema";
import { db } from "src/db/database";
import type { UserSignInDto, UserSignUpDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
	async signUp(dto: UserSignUpDto) {
		const { headers, response } = await auth.api.signUpEmail({
			returnHeaders: true,
			body: dto,
    });


		return { user: response.user, token: headers.get("set-auth-token") };
	}

	async signIn(dto: UserSignInDto) {
		const { headers, response } = await auth.api.signInEmail({
			returnHeaders: true,
			body: dto,
		});

		return { user: response.user, token: headers.get("set-auth-token") };
	}

	async me(userId: string) {
		const [profile] = await db
			.select()
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!profile)
			throw new NotFoundException(`User with ${userId} is not found`);

		return profile;
	}
}
