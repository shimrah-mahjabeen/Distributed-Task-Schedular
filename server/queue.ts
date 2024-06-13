import { Worker } from 'bullmq';
import { redisOptions } from './queueConfig'; // Assuming this file contains your Redis connection options
import pool from './database'; // Assuming this file contains your database connection

const taskWorker = new Worker(
	'tasks',
	async (job) => {
		const { taskId, cronPattern } = job.data;

		// Update task status in the database
		try {
			await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', ['completed', taskId]);
		} catch (error) {
			console.error(`Error updating task ${taskId} status: ${(error as Error).message}`);
		}
	},
	{ connection: redisOptions }
);

taskWorker.on('completed', (job) => {
	console.log(`Task ${job.data.taskId} completed`);
});

taskWorker.on('failed', (job, err) => {
	console.log(`Task ${job?.data.taskId} failed with error: ${err.message}`);
});

taskWorker.on('error', (err) => {
	console.error('BullMQ worker error:', err);
});

console.log('BullMQ worker started!');
