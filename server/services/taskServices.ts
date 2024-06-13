import moment from 'moment-timezone';
import cron from 'node-cron';

import { taskQueue, cronJobs } from '../queueConfig';
import pool from '../database';
import { io } from '../src/index';

export const getCronPattern = (timestamp: string) => {
	const date = moment(timestamp);
	const minute = date.minutes();
	const hour = date.hours();
	const dayOfMonth = date.date();
	const month = date.month() + 1;

	return `${minute} ${hour} ${dayOfMonth} ${month} *`;
};

export const reschedulePendingTasks = async () => {
	try {
		const result = await pool.query('SELECT * FROM tasks WHERE status = $1', ['pending']);
		result.rows.forEach(async (task) => {
			const { id: taskId, type, schedule } = task;
			const cronPattern = type === 'one-time' ? getCronPattern(schedule) : schedule;

			// Schedule a new cron job
			const job = cron.schedule(cronPattern, async () => {
				const task = await taskQueue.add('task', { taskId, cronPattern });
				console.log(`Cron job executing for task ${taskId} with cron pattern ${cronPattern}`);

				const queueTaskID: string = task.id || '0';
				await taskQueue.getJob(queueTaskID);
				io.emit('taskUpdated', taskId); // Emitting an event for task update
			});
			cronJobs[taskId] = job;
			job.start();
		});
	} catch (error) {
		console.error(`Error rescheduling pending tasks: ${(error as Error).message}`);
	}
};
