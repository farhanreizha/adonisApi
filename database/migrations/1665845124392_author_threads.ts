import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
	protected tableName = "author_threads";

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.integer("user_id").unsigned().references("users.id").notNullable().onDelete("CASCADE");
			table.integer("thread_id").unsigned().references("threads.id").notNullable().onDelete("CASCADE");
			table.integer("author_type_id").unsigned().defaultTo(1);

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp("created_at", { useTz: true });
			table.timestamp("updated_at", { useTz: true });
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
