import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
	public async register({ request, response }: HttpContextContract) {
		const data = await request.validate(RegisterValidator);
		await User.create(data);
		return response.created({ status: true, message: "created successed" });
	}

	public async login({ request, response, auth }: HttpContextContract) {
		const { uid, password } = await request.validate(LoginValidator);
		const auths = await auth.use("api").attempt(uid, password);
		const userId = auths.user.id;

		return response.ok({
			status: true,
			message: "Login Successed",
			token: auths.token,
			userId,
		});
	}

	public async logout({ response, auth }: HttpContextContract) {
		await auth.use("api").logout();
		return response.ok({ status: true, message: "Logout Successed" });
	}
}
