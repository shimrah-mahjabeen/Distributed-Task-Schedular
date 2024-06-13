import { Router } from 'express';

import { addTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/TasksController';

const router = Router();

router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
