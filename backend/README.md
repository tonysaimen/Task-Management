# Task Management Backend

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- Request: `{ email, password, name }`
- Response: `{ token, user }`

#### Login
- **POST** `/api/auth/login`
- Request: `{ email, password }`
- Response: `{ token, user }`

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer {token}`
- Response: `{ user }`

### Task Endpoints

#### Get All Tasks
- **GET** `/api/tasks`
- Headers: `Authorization: Bearer {token}`
- Query: `?status=pending&priority=high&search=task&sort=-createdAt`
- Response: `{ tasks, total }`

#### Create Task
- **POST** `/api/tasks`
- Headers: `Authorization: Bearer {token}`
- Request: `{ title, description, priority, dueDate, status, assignedTo }`
- Response: `{ task }`

#### Get Task
- **GET** `/api/tasks/:id`
- Headers: `Authorization: Bearer {token}`
- Response: `{ task }`

#### Update Task
- **PUT** `/api/tasks/:id`
- Headers: `Authorization: Bearer {token}`
- Request: `{ title, description, priority, dueDate, status }`
- Response: `{ task }`

#### Delete Task
- **DELETE** `/api/tasks/:id`
- Headers: `Authorization: Bearer {token}`
- Response: `{ message }`

### Dashboard Endpoints

#### Get Dashboard Stats
- **GET** `/api/dashboard/stats`
- Headers: `Authorization: Bearer {token}`
- Response: `{ totalTasks, completedTasks, pendingTasks, inProgressTasks }`

#### Get Task Activity
- **GET** `/api/dashboard/activity`
- Headers: `Authorization: Bearer {token}`
- Response: `{ activities }`

## Environment Variables

Create a `.env` file in `backend/` with these common settings (example):

```
MONGODB_URI=mongodb://admin:password123@localhost:27017/task-management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=7d
SOCKET_IO_ENABLED=true
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:3000
```

If you run locally without MongoDB installed, the backend will fall back to an in-memory MongoDB for development.

Socket.IO is enabled by default when `SOCKET_IO_ENABLED` is `true`. The server emits:
- `task:created` — payload: task object
- `task:updated` — payload: task object
- `task:deleted` — payload: task id
- `users:online` — payload: array of online user descriptors

See `docker-compose.yml` at the repository root to run MongoDB and the services as containers.
