import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import ThreadComment from "./ThreadComment";

export default class Thread extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: number;

	@column()
	public description: string;

	@column.dateTime()
	public createdAt: DateTime;

	@column.dateTime({ autoUpdate: true })
	public updatedAt: DateTime;

	@belongsTo(() => User)
	public authors: BelongsTo<typeof User>;
	// @manyToMany(() => User, { pivotTable: "author_threads", pivotColumns: ["author_type_id"] })
	// public authors: ManyToMany<typeof User>;

	@manyToMany(() => User, { pivotTable: "thread_likes" })
	public userLikes: ManyToMany<typeof User>;

	@hasMany(() => ThreadComment, { foreignKey: "threadId" })
	public userComments: HasMany<typeof ThreadComment>;

	@manyToMany(() => User, { pivotTable: "thread_saves" })
	public userSave: ManyToMany<typeof User>;
}
