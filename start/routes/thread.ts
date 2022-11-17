import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/thread", "ThreadsController.create");
  Route.get("/thread", "ThreadsController.getThread");
  Route.get("/thread/detail/:id", "ThreadsController.threadDetail");
  Route.put("/thread/:id", "ThreadsController.update");
  Route.delete("/thread/:id", "ThreadsController.delete");

  Route.post("/thread/:id/like", "ThreadsController.like");

  Route.post("/thread/comment", "ThreadsController.comment");
  Route.put("/thread/:id/comment", "ThreadsController.commentUpdate");
  Route.delete("/thread/:id/comment", "ThreadsController.commentDelete");

  Route.post("/thread/:id/save", "ThreadsController.save");
})
  .middleware("auth")
  .prefix("/api");
