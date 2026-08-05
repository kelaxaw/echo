import * as authSchema from "../auth/auth.schema";
import * as recordsSchema from "./schemas/recordings";
import * as reflectionsSchema from "./schemas/reflections";
import * as reportsSchema from "./schemas/reports";

export const SCHEMA = {
	...recordsSchema,
	...reflectionsSchema,
	...reportsSchema,
	...authSchema,
};
