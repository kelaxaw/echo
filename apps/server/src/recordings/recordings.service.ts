import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Inject, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { type Database, DRIZZLE } from "src/db/database.module";
import { STORAGE } from "src/storage/storage.module";

export class UserIdDto {
	@ApiProperty({ title: "userId" })
	userId: string;
}

@Injectable()
export class RecordingsService {
	constructor(
		@Inject(DRIZZLE) private readonly db: Database,
		@Inject(STORAGE) private readonly s3: S3Client,
	) {}

	async generateUploadUrl({ userId }: UserIdDto) {
		const key = `recordings/${userId}/${crypto.randomUUID()}.m4a`;

		const url = await getSignedUrl(
			this.s3,
			new PutObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key: key }),
			{ expiresIn: 3600 },
		);

		return {
			url,
			key,
		};
	}
}
