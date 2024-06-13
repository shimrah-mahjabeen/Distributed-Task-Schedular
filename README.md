## Design Document for Distributed Task Scheduler

### High-Level Design

#### Components

1. **Client Interface**:
   - A GUI built with React for task creation, scheduling, and management.
   - Users can view scheduled tasks, edit, or delete them.

2. **Task Scheduler Service**:
   - Backend API to handle task registration, updates, deletions, and retrievals.
   - Uses Socket.io for continuous listening of task scheduling requests.

3. **Scheduler and Queue System**:
   - Cron and BullMQ are used for task scheduling and queuing.
   - Cron syntax is used for recurring tasks.
   - BullMQ manages task execution and ensures tasks are picked up within 10 seconds of the scheduled time.

4. **Database**:
   - PostgreSQL is used to store task information
   - Ensures durability and persistence of task data.

5. **Docker**:
   - Docker is used for containerization, ensuring the application is easy to deploy and run.

#### Detailed Design

1. **Client Interface**:
   - Built with React, providing an intuitive GUI for users to create, view, edit, and delete tasks.
   - Logs of executed tasks are displayed with timestamps.

2. **Backend API**:
   - Implemented using Node.js with Express.
   - Uses Socket.io for real-time communication with the client.
   - Endpoints for task creation, editing, deletion, and retrieval.
   - Example endpoints:
     - `POST /tasks`: Create a new task.
     - `PUT /tasks/:id`: Edit an existing task.
     - `DELETE /tasks/:id`: Delete a task.
     - `GET /tasks`: Retrieve the list of scheduled tasks.

3. **Task Scheduling**:
   - Cron is used to interpret Cron syntax for recurring tasks.
   - BullMQ handles the task queue, ensuring tasks are executed on time.
   - Tasks are stored in PostgreSQL, and on server restart, tasks are reloaded and rescheduled.

4. **Scalability**:
   - BullMQ ensures efficient management of a large number of tasks.
   - The system is designed to scale horizontally by adding more instances of the scheduler service.
   - PostgreSQL ensures data durability

5. **Fault Tolerance**:
   - If the server crashes, tasks are not lost. Upon restart, tasks are reloaded from the database and rescheduled.
   - Docker ensures that the environment is consistent across different deployments, reducing potential issues from environment discrepancies.

### Edge Cases Handled

1. **Server Crash**:
   - Tasks are stored in PostgreSQL, ensuring they persist through crashes.
   - On server restart, tasks are reloaded and rescheduled.

2. **Concurrent Modifications**:
   - Proper locking mechanisms in BullMQ to handle concurrent task edits or deletions.

3. **Network Issues**:
   - Socket.io ensures reliable communication between client and server.

### Deployment and Running Instructions

#### Docker Setup

1. **Dockerfile**: Define the environment for the Node.js backend and PostgreSQL.
2. **docker-compose.yml**: Define the services, including the backend, database, and any other necessary services.

#### Steps to Run

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-repo/distributed-task-scheduler.git
   cd distributed-task-scheduler
   ```

2. **Build and Run Docker Containers**:
   ```sh
   docker-compose up --build
   ```

3. **Access the Application**:
   - Open a browser and navigate to `http://localhost:3000` to access the React GUI.

### Local Setup
#### Prerequisites

   - Node.js >= 16
   - npm
   - PostgreSQL
   - Redis

#### Steps to Run

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-repo/distributed-task-scheduler.git
   cd distributed-task-scheduler
   ```

## Installation and Setup

### Install Dependencies

For the client:

```sh
cd client
npm install
```

For the client:

```sh
cd server
npm run dev
```

## Configuration and Setup

### Configure Environment Variables

Change the database and Redis host to localhost in the server's environment configuration:

```sh
DB_HOST=localhost to DB_HOST=db
REDIS_HOST=localhost to REDIS_HOST=redis
```

## Create the Database

### Access PostgreSQL and create the necessary database:

```sh
psql -U username -d dbname
```

## Connect to the database

### Connect to the database:

```sh
\c task_schedular
```

## Run Migrations:

### Apply database migrations:

```sh
npx knex migrate:latest --knexfile knexfile.js
```

## Start the Application:

### Start the client:

```sh
cd client
npm start
```


### Start the server:

```sh
cd server
npm run dev
```


### Conclusion

The Distributed Task Scheduler is a robust, scalable, and fault-tolerant system designed to handle both one-time and recurring tasks. By leveraging Cron, BullMQ, PostgreSQL, and Docker, the system ensures high availability and durability. The React-based GUI provides an intuitive interface for task management, making the system user-friendly and efficient.