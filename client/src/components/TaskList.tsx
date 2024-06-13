import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
	return (
		<ul className='list-group'>
			{tasks.map((task) => (
				<TaskItem key={task.id} task={task} />
			))}
		</ul>
	);
};

export default TaskList;
