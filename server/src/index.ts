import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import taskRoutes from '../routes/tasks';
import pool from '../database';
import { setSocketIO } from '../controllers/TasksController';
import { reschedulePendingTasks } from '../services/taskServices';
import '../queue';

dotenv.config();

// Initialize the app
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000', // Allow requests from this origin
		methods: ['GET', 'POST'], // Allow only GET and POST requests
	},
});

// Set the io instance in TaskController
setSocketIO(io);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection test
pool.connect((err, client, done) => {
	if (err) {
		console.error('Error connecting to the database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});

// Routes
app.use('/api', taskRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: err.message });
});

// Root route
app.get('/', (req: Request, res: Response) => {
	res.send('Distributed Task Scheduler API');
});

// WebSocket connections
io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	// Reschedule pending tasks
	await reschedulePendingTasks();
});

export { io };
