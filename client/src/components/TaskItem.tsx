import React from 'react';
import { Link } from 'react-router-dom';
import { deleteTask } from '../services/api';
import { Task } from '../types';

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const handleDelete = async () => {
    await deleteTask(task.id);
    window.location.reload();
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <p className="mb-1">Type: {task.type}</p>
        <p className="mb-1">Schedule: {task.schedule}</p>
      </div>
      <div>
        {task.status === 'pending' && (
          <Link to={`/edit-task/${task.id}`} className="btn btn-secondary btn-sm mx-2">Edit</Link>
        )}
        <button onClick={handleDelete} className="btn btn-danger btn-sm">Delete</button>
      </div>
    </li>
  );
};

export default TaskItem;
