import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TaskList from '../components/TaskList';
import { getTasks } from '../services/api';
import { Task } from '../types';
import io from 'socket.io-client';

const Home: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		fetchTasks();

		const socket = io('http://localhost:5001');
		socket.on('connect', () => {
			console.log('WebSocket connected');
		});
		socket.on('taskUpdated', (taskId: string) => {
			fetchTasks(); // Fetch tasks when a task update event is received
		});
		socket.on('disconnect', () => {
			console.log('WebSocket disconnected');
		});

		return () => {
			socket.disconnect(); // Disconnect the WebSocket on component unmount
		};
	}, []);

	const fetchTasks = async () => {
		const { data } = await getTasks();
		setTasks(data);
	};

	const scheduledTasks = tasks?.filter((task) => task.status === 'pending');
	const completedTasks = tasks?.filter((task) => task.status === 'completed');

	return (
		<div className='container mt-5'>
			<h1 className='mb-4'>Task Scheduler</h1>
			<Link to='/add-task' className='btn btn-primary mb-3'>
				Add Task
			</Link>
			<div className='row'>
				<div className='col-md-6'>
					<h2>Scheduled Tasks</h2>
					<TaskList tasks={scheduledTasks} />
				</div>
				<div className='col-md-6'>
					<h2>Completed Tasks</h2>
					<TaskList tasks={completedTasks} />
				</div>
			</div>
		</div>
	);
};

export default Home;
