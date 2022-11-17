import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
	Route.get("/profile", "UsersController.getMyProfile");
	Route.get("/profile/user/:username", "UsersController.getUser");
	Route.put("/profile", "UsersController.updateProfile");
	Route.put("/profile/edit/password", "UsersController.changePassword");
})
	.middleware("auth")
	.prefix("/api");
