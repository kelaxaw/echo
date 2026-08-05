import { S3Client } from "@aws-sdk/client-s3";

const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY;

if (!STORAGE_ACCESS_KEY || !STORAGE_SECRET_KEY)
	throw new Error("Storage env keys are undefined");

export const storage = new S3Client({
	region: "ru-central1",
	endpoint: "https://storage.yandexcloud.net",
	credentials: {
		accessKeyId: STORAGE_ACCESS_KEY,
		secretAccessKey: STORAGE_SECRET_KEY,
	},
});
