require('dotenv').config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {
// 	development: {
// 		client: 'pg',
// 		connection: {
// 			host: 'db',
// 			user: 'postgres',
// 			password: 'postgres',
// 			database: 'task_schedular',
// 		},
// 		migrations: {
// 			directory: './migrations',
// 		},
// 	},
// };

module.exports = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.DB_HOST || "db",
			user: process.env.DB_USER || "postgres",
			password: process.env.DB_PASSWORD || "postgres",
			database: process.env.DB_DATABASE || "task_schedular",
		},
		migrations: {
			directory: './migrations',
		},
	},
};
