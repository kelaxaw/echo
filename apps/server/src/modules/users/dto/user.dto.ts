import { ApiProperty } from "@nestjs/swagger";

export class UserSignUpDto {
  @ApiProperty({ title: "Name" })
  name: string;
  @ApiProperty({ title: "Email" })
  email: string;
  @ApiProperty({ title: "Password" })
  password: string;
}

export class UserSignInDto {
  @ApiProperty({ title: "Email" })
  email: string;
  @ApiProperty({ title: "Password" })
  password: string;
}
