// import { Queue } from 'bullmq';
// import cron from 'node-cron';

// export const redisOptions = { host: 'redis', port: 6379 };

// export const taskQueue = new Queue('tasks', { connection: redisOptions });

// export const cronJobs: { [taskId: string]: cron.ScheduledTask } = {};


import { Queue } from 'bullmq';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

export const redisOptions = {
	host: process.env.REDIS_HOST || 'redis',
	port: Number(process.env.REDIS_PORT) || 6379,
};

export const taskQueue = new Queue('tasks', { connection: redisOptions });

export const cronJobs: { [taskId: string]: cron.ScheduledTask } = {};