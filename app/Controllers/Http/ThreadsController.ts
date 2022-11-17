import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Thread from "App/Models/Thread";
import ThreadComment from "App/Models/ThreadComment";
import ThreadValidator from "App/Validators/ThreadValidator";
import { schema, rules, validator } from "@ioc:Adonis/Core/Validator";

export default class ThreadsController {
	public async create({ request, response, auth }: HttpContextContract) {
		const description = await request.validate(ThreadValidator);
		await auth.user!.related("threads").create(description);

		return response.created({ status: true, message: "Thread Created" });
	}

	public async getThread({ request }: HttpContextContract) {
		const { page = 1, shortBy = "createdAt", short = "desc" } = request.qs();
		const thread = await Thread.query()
			.preload("authors")
			.preload("userLikes")
			.preload("userSave")
			.preload("userComments")
			.orderBy(shortBy, short)
			.paginate(page, 12);

		return thread;
	}

	public async threadDetail({ params }: HttpContextContract) {
		const thread = await Thread.query()
			.where("id", params.id)
			.preload("authors")
			.preload("userLikes")
			.preload("userSave")
			.preload("userComments", (query) => query.preload("users"))
			.first();

		return thread;
	}

	public async update({ request, response, params }: HttpContextContract) {
		const thread = await Thread.findOrFail(params.id);
		const description = await request.validate(ThreadValidator);
		thread.merge(description);
		await thread.save();

		return response.created({ status: true, message: "Update thread successed" });
	}

	public async delete({ response, params }: HttpContextContract) {
		await Thread.query().where("id", params.id).delete();

		return response.ok({ status: true, message: "Deleted thread successed" });
	}

	public async like({ response, params, auth }: HttpContextContract) {
		const user = auth.user!;
		const isLike = await user.related("threadLikes").query().where("threads.id", params.id).first();
		if (isLike) {
			await user.related("threadLikes").detach([params.id]);
			return response.ok({ status: true, message: "Unlike successed" });
		}
		await user.related("threadLikes").attach([params.id]);

		return response.created({ status: true, message: "Like successed" });
	}

	public async comment({ request, response, auth }: HttpContextContract) {
		const user = auth.user!;
		const _schema = schema.create({
			threadId: schema.number([rules.exists({ table: "threads", column: "id" })]),
			replayTo: schema.number.optional([rules.exists({ table: "thread_comments", column: "id" })]),
			body: schema.string({ trim: true }),
		});
		const { body, ...data } = await validator.validate({ schema: _schema, data: request.body() });

		await ThreadComment.create({
			...data,
			body,
			userId: user.id,
		});
		// comment.replayTo ? await Notification.onCommentReplay() : Notification.onComment()

		return response.created({ status: true, message: "Comment successed" });
	}

	public async commentUpdate({ request, response, params }: HttpContextContract) {
		const comment = await ThreadComment.findOrFail(params.id);
		comment.merge(request.body());
		await comment.save();

		return response.created({ status: true, message: "Update comment successed" });
	}

	public async commentDelete({ response, params }: HttpContextContract) {
		const thread = await ThreadComment.findOrFail(params.id);
		await thread.related("parent").dissociate();
		await thread.related("users").dissociate();
		await thread.delete();

		return response.ok({ status: true, message: "Deleted thread successed" });
	}

	public async save({ response, params, auth }: HttpContextContract) {
		const user = auth.user!;
		const isSave = await user.related("threadSave").query().where("threads.id", params.id).first();
		if (isSave) {
			await user.related("threadSave").detach([params.id]);
			return response.ok({ status: true, message: "Unsave successed" });
		}
		await user.related("threadSave").attach([params.id]);

		return response.created({ status: true, message: "Save successed" });
	}
}
