// import { Pool } from 'pg';

// const pool = new Pool({
// 	user: 'postgres',
// 	host: 'localhost',
// 	database: 'task_schedular',
// 	password: 'postgres',
// 	port: 5432,
// });

// export default pool;


import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || "db",
	database: process.env.DB_DATABASE || "task_schedular",
	password: process.env.DB_PASSWORD || 'postgres',
	port: Number(process.env.DB_PORT) || 5432,
});

export default pool;
