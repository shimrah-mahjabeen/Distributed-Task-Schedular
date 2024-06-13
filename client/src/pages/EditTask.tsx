import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { getTaskById, updateTask } from '../services/api';

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<{ type: string; schedule: string } | null>(null);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const { data } = await getTaskById(Number(id));
    setTask(data);
  };

  const handleUpdateTask = async (updatedTask: { type: string; schedule: string }) => {
    await updateTask(Number(id), updatedTask);
    navigate('/');
  };

  return (
		<div className='container mt-5'>
			<h1 className='mb-4'>Edit Task</h1>
			{task ? <TaskForm onSubmit={handleUpdateTask} /> : <p>Loading...</p>}
		</div>
	);
};

export default EditTask;
