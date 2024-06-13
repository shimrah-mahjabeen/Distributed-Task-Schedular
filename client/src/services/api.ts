import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5001/api',
});

export const getTasks = () => api.get('/tasks');
export const getTaskById = (id: number) => api.get(`/tasks/${id}`);
export const addTask = (task: { type: string; schedule: string }) => api.post('/tasks', task);
export const updateTask = (id: number, task: { type: string; schedule: string }) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export default api;
