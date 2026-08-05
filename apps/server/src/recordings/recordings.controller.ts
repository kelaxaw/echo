import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { RecordingsService } from "./recordings.service";

export class UserIdDto {
	@ApiProperty({ title: "userId" })
	userId: string;
}

@Controller("recordings")
export class RecordingsController {
	constructor(private readonly recordingsService: RecordingsService) {}

	@Post("generate-upload-url")
	@ApiBearerAuth()
	@ApiOperation({ summary: "Generate s3 upload link for client" })
	generateUploadUrl(@Body() dto: UserIdDto) {
		return this.recordingsService.generateUploadUrl(dto);
	}
}
