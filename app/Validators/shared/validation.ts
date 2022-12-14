import { rules, schema } from "@ioc:Adonis/Core/Validator";

export const usernameValidation = schema.string({ trim: true }, [
	rules.maxLength(50),
	rules.minLength(3),
	rules.regex(/^[a-zA-Z0-9-_]+$/),
	rules.unique({ table: "users", column: "username", caseInsensitive: true }),
]);
