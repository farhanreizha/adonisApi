import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { column, beforeSave, BaseModel, hasOne, HasOne, manyToMany, ManyToMany, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import ApiToken from "./ApiToken";
import Thread from "./Thread";
import ThreadComment from "./ThreadComment";

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public username: string;

	@column()
	public displayName?: string;

	@column()
	public email: string;

	@column({ serializeAs: null })
	public password: string;

	@column()
	public rememberMeToken?: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@beforeSave()
	public static async hashPassword(User: User) {
		if (User.$dirty.password) {
			User.password = await Hash.make(User.password);
		}
	}

	@beforeSave()
	public static async addDisplayName(User: User) {
		User.displayName = User.username;
	}

	@hasOne(() => ApiToken, { foreignKey: "userId" })
	public token: HasOne<typeof ApiToken>;

	@hasMany(() => Thread, { foreignKey: "userId" })
	public threads: HasMany<typeof Thread>;

	@hasOne(() => Thread, { foreignKey: "userId" })
	public threadDetail: HasOne<typeof Thread>;
	// @manyToMany(() => Thread, { pivotTable: "author_threads", pivotColumns: ["author_type_id"] })
	// public threads: ManyToMany<typeof Thread>;

	@manyToMany(() => Thread, { pivotTable: "thread_likes" })
	public threadLikes: ManyToMany<typeof Thread>;

	@hasOne(() => ThreadComment, { foreignKey: "userId" })
	public threadComments: HasOne<typeof ThreadComment>;

	@manyToMany(() => Thread, { pivotTable: "thread_saves" })
	public threadSave: ManyToMany<typeof Thread>;
}
