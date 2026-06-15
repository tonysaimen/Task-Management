# Task Management Frontend

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Build

```bash
npm run build
```

## Features

- User registration and login
- Create, read, update, and delete tasks
- Task filtering and sorting
- Real-time task updates via Socket.IO
- Task statistics and dashboard
- Responsive design
- Role-based access control
- Task categories and tags
- Due date tracking
- Task priority levels

## Technology Stack

- React 18
- TypeScript
- Redux Toolkit for state management
- Axios for API calls
- Socket.IO for real-time updates
- CSS Modules for styling

## Environment

Create a `.env` file at the `frontend/` root with:

```
VITE_API_URL=http://localhost:5000
```

Note: Vite requires `VITE_` prefix for env variables. The frontend will use this value to connect to the backend API and Socket.IO server.

## Real-time (Socket.IO)

The frontend connects to the backend Socket.IO server after authentication. The client code is in `src/utils/socket.ts` and the app mounts the connection via `src/features/socketInitializer.tsx`.

Events:
- `task:created`
- `task:updated`
- `task:deleted`
- `users:online`

## Build

```bash
npm run build
npm run preview
```
