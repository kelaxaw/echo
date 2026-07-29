import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	AllowAnonymous,
	Session,
	type UserSession,
} from "@thallesp/nestjs-better-auth";
import type { auth } from "src/auth/auth";

import type { UserSignInDto, UserSignUpDto } from "./dto/user.dto";
import type { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@AllowAnonymous()
	@Post("sign-up")
	@ApiOperation({ summary: "Create new account" })
	signUp(@Body() dto: UserSignUpDto) {
		return this.usersService.signUp(dto);
	}

	@AllowAnonymous()
	@Post("sign-in")
	@ApiOperation({ summary: "Sign in to existing account" })
	signIn(@Body() dto: UserSignInDto) {
		return this.usersService.signIn(dto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Get current user" })
	@Get("me")
	me(@Session() session: UserSession<typeof auth>) {
		return this.usersService.me(session.user.id);
	}
}
