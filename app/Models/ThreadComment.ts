import { DateTime } from "luxon";
import { BaseModel, afterSave, BelongsTo, belongsTo, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Thread from "./Thread";

export default class ThreadComment extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: number;

	@column()
	public threadId: number;

	@column()
	public replayTo?: number;

	@column()
	public body: string;

	@column()
	public parentId: number;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@afterSave()
	public static async parentIds(comment: ThreadComment) {
		comment.parentId = comment.id;
		await comment.save();
	}

	@belongsTo(() => User)
	public users: BelongsTo<typeof User>;

	@belongsTo(() => Thread)
	public threads: BelongsTo<typeof Thread>;

	@hasMany(() => ThreadComment, { foreignKey: "replayTo" })
	public responses: HasMany<typeof ThreadComment>;

	@belongsTo(() => ThreadComment, { foreignKey: "replayTo" })
	public parent: BelongsTo<typeof ThreadComment>;
}
