import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
	Route.post("/sign-up", "AuthController.register");
	Route.post("/sign-in", "AuthController.login");
	Route.post("/sign-out", "AuthController.logout").middleware("auth");
}).prefix("/api");
