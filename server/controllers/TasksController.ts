import { Request, Response } from 'express';
import { Server } from 'socket.io';
import cron from 'node-cron';

import { taskQueue } from '../queueConfig';
import pool from '../database';
import { getCronPattern } from '../services/taskServices';

// Mapping of task IDs to cron jobs
const cronJobs: { [taskId: string]: cron.ScheduledTask } = {};
let io: Server;

export const setSocketIO = (socketIO: Server) => {
	io = socketIO;
};

export const addTask = async (req: Request, res: Response) => {
	const { type, schedule } = req.body;
	try {
		const result = await pool.query('INSERT INTO tasks (type, schedule, status) VALUES ($1, $2, $3) RETURNING *', [
			type,
			schedule,
			'pending',
		]);

		const taskId = result.rows[0].id;
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
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const getTasks = async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT * FROM tasks');
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const getTaskById = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Task not found' });
		} else {
			res.status(200).json(result.rows[0]);
		}
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const updateTask = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { type, schedule } = req.body;

	try {
		const result = await pool.query(
			'UPDATE tasks SET type = $1, schedule = $2, status = $3 WHERE id = $4 RETURNING *',
			[type, schedule, 'pending', id]
		);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Task not found' });
		} else {
			// Cancel the existing cron job
			if (cronJobs[id]) {
				cronJobs[id].stop();
				delete cronJobs[id];
			}

			// Schedule a new cron job
			const cronPattern = type === 'one-time' ? getCronPattern(schedule) : schedule;
			const job = cron.schedule(cronPattern, async () => {
				// Update task status to completed
				await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', ['completed', id]);
			});
			cronJobs[id] = job;

			job.start();

			res.status(200).json(result.rows[0]);
		}
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Task not found' });
		} else {
			// Cancel the cron job associated with the deleted task
			if (cronJobs[id]) {
				cronJobs[id].stop();
				delete cronJobs[id];
			}

			res.status(200).json({ message: 'Task deleted successfully' });
		}
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};
