import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserUpdateValidator from "App/Validators/UserUpdateValidator";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";

export default class UsersController {
	public async getMyProfile({ auth }: HttpContextContract) {
		const user = auth.user!;
		user.load("threads");
		return user;
	}
	public async getUser({ params }: HttpContextContract) {
		const user = await User.findBy("username", params.username);
		await user!.load("threads");
		return user;
	}

	public async updateProfile({ auth, response, request }: HttpContextContract) {
		const data = await request.validate(UserUpdateValidator);
		const id = auth.use("api").user!.id;
		await User.query()
			.where("id", id as number)
			.update(data);

		return response.created({ status: true, message: "Update profile successed" });
	}

	public async changePassword({ auth, request, response }: HttpContextContract) {
		const id = auth.use("api").user!.id;
		const { password } = await request.validate(ChangePasswordValidator);

		await User.updateOrCreate({ id }, { password });
		await auth.use("api").logout();

		return response.created({ status: true, message: "Update password successed" });
	}
}
