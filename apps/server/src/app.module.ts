import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth/auth";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [AuthModule.forRoot({ auth }), UsersModule],
})
export class AppModule {}
