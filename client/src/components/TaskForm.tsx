import React, { useState } from 'react';

const TaskForm: React.FC<{ onSubmit: (task: { type: string; schedule: string }) => void }> = ({ onSubmit }) => {
	const [type, setType] = useState('one-time');
	const [schedule, setSchedule] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ type, schedule });
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<label htmlFor='taskType'>Type:</label>
				<select id='taskType' className='form-control' value={type} onChange={(e) => setType(e.target.value)}>
					<option value='one-time'>One-time</option>
					<option value='recurring'>Recurring</option>
				</select>
			</div>
			<div className='form-group'>
				{type === 'one-time' && (
					<>
						<label htmlFor='executionTime'>Execution Time:</label>
						<input
							id='executionTime'
							type='datetime-local'
							className='form-control'
							value={schedule}
							onChange={(e) => setSchedule(e.target.value)}
						/>
					</>
				)}

				{type === 'recurring' && (
					<>
						<label htmlFor='cronExpression'>Cron Expression:</label>
						<input
							id='cronExpression'
							type='text'
							className='form-control'
							value={schedule}
							onChange={(e) => setSchedule(e.target.value)}
						/>
					</>
				)}
			</div>
			<button type='submit' className='btn btn-primary mt-3'>
				Submit
			</button>
		</form>
	);
};

export default TaskForm;
