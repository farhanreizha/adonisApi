import { rules, schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { usernameValidation } from "./shared/validation";

export default class UserUpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		username: usernameValidation,
		display_name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
	});

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = {
		"required": "{{field}} can't be empty",
		"username.minLength": "{{field}} min {{options.minLength}} characte",
		"username.maxLength": "{{field}} max {{options.maxLength}} character",
		"username.unique": "{{field}} has been used",
		"display_name.minLength": "{{field}} min {{options.minLength}} characte",
		"display_name.maxLength": "{{field}} max {{options.maxLength}} character",
	};
}
