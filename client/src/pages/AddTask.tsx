import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { addTask } from '../services/api';

const AddTask: React.FC = () => {
  const navigate = useNavigate();

  const handleAddTask = async (task: { type: string; schedule: string }) => {
    await addTask(task);
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Task</h1>
      <TaskForm onSubmit={handleAddTask} />
    </div>
  );
};

export default AddTask;
