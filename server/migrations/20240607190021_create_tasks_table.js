exports.up = function (knex) {
	return knex.schema.createTable('tasks', (table) => {
		table.increments('id').primary();
		table.string('type').notNullable();
		table.string('schedule').notNullable();
		table.string('status').defaultTo('pending');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('tasks');
};
