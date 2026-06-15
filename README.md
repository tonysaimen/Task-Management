# Task Management (Full-stack)

Modern Task Management application (React + Node/Express + MongoDB + Socket.IO). This workspace contains a TypeScript backend and a Vite + React TypeScript frontend with real-time updates.

**Folders**
- `backend` — Express + TypeScript API, Mongoose models, Socket.IO server
- `frontend` — React + TypeScript (Vite), Redux Toolkit, Socket.IO client

**Quick Start (local development)**
Prerequisites: Node.js >= 18, npm (or pnpm/yarn), optional Docker for containers.

1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Start dev servers (backend + frontend)

```bash
# In one terminal
cd backend
npm run dev

# In another terminal
cd frontend
npm run start
```

3. Open the frontend at `http://localhost:3000`. Backend API runs at `http://localhost:5000` by default.

**Environment (sample)**
- Backend: create `backend/.env` with values from `.env.example` (see `backend/README.md`)
- Frontend: set `VITE_API_URL` (used by Vite) or `REACT_APP_API_URL` for legacy clients.

**Docker (optional)**
This repo includes `docker-compose.yml` to run MongoDB, backend, and frontend. To start services:

```bash
docker compose up --build
```

**Project notes**
- Real-time updates use Socket.IO. Backend emits `task:created`, `task:updated`, `task:deleted` and `users:online` events.
- Auth uses JWT with middleware at `backend/src/middleware/auth.ts`.

**Useful files**
- Backend entry: [backend/src/server.ts](backend/src/server.ts#L1)
- Frontend entry: [frontend/src/main.tsx](frontend/src/main.tsx#L1)

If you want, I can generate a more detailed developer guide, CI config, or deployment guide next.
# Task Management Web Application

A full-stack, production-ready task management application built with React, Node.js, Express, and MongoDB. Designed for individuals and teams to efficiently organize, track, and collaborate on tasks.

## 🎯 Features

### Authentication & Authorization
- User registration and login with JWT
- Secure password hashing with bcryptjs
- Role-based access control (User, Admin)
- Protected routes and endpoints

### Task Management
- Create, read, update, and delete tasks
- Set task priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Due date tracking and notifications
- Task tags and categorization
- Comments and collaboration features

### Dashboard & Analytics
- Real-time task statistics
- Completion rate tracking
- Activity timeline
- Overdue task alerts
- High-priority task indicators
- Visual progress tracking

### User Experience
- Responsive design (Mobile, Tablet, Desktop)
- Real-time updates via Socket.IO
- Advanced search and filtering
- Sorting capabilities
- Clean, modern UI inspired by Trello, Notion, and Asana
- Error handling and user feedback

## 📋 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Router** - Navigation
- **CSS3** - Modern styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.IO** - Real-time updates
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting
- **Morgan** - HTTP logging

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Using Docker
```bash
docker-compose up
```

All services will start:
- MongoDB: mongodb://admin:password123@localhost:27017
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── src/
│   │   ├── models/          # Database schemas (User, Task)
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, error handling
│   │   ├── config/           # Database configuration
│   │   ├── socket/           # Socket.IO handlers
│   │   ├── utils/            # Utility functions
│   │   └── server.ts         # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux slices
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   ├── styles/           # CSS stylesheets
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx           # Main app component
│   │   └── index.tsx         # React entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── .env.example
├── docker-compose.yml
└── README.md
```

## 🔐 Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

### Backend (.env)
```env
BACKEND_PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRATION=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SOCKET_IO_ENABLED=true
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user }
```

### Task Endpoints

#### Get All Tasks
```
GET /api/tasks?status=pending&priority=high&search=query&sort=-createdAt
Headers: Authorization: Bearer {token}
Response: { data: [], total: number }
```

#### Create Task
```
POST /api/tasks
Headers: Authorization: Bearer {token}
Body: { title, description, priority, dueDate, status, tags }
Response: { data: Task }
```

#### Update Task
```
PUT /api/tasks/:id
Headers: Authorization: Bearer {token}
Body: { title, description, priority, dueDate, status }
Response: { data: Task }
```

#### Delete Task
```
DELETE /api/tasks/:id
Headers: Authorization: Bearer {token}
Response: { success: true }
```

### Dashboard Endpoints

#### Get Stats
```
GET /api/dashboard/stats
Headers: Authorization: Bearer {token}
Response: { 
  data: { 
    totalTasks, completedTasks, inProgressTasks, 
    pendingTasks, highPriorityTasks, overdueTasks, completionRate 
  } 
}
```

#### Get Recent Activity
```
GET /api/dashboard/activity
Headers: Authorization: Bearer {token}
Response: { data: Task[] }
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface inspired by Trello, Notion, and Asana
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Task Cards**: Visual task representation with priority and status badges
- **Real-time Updates**: Socket.IO integration for live task changes
- **Progress Tracking**: Visual progress bars and completion metrics
- **Alert System**: Notifications for overdue and high-priority tasks
- **Search & Filter**: Advanced task search and filtering capabilities
- **Dark/Light Mode Ready**: CSS structured for theme switching

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Environment variables for sensitive data
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for HTTP header security
- Input validation and sanitization
- Protected API endpoints

## 🚢 Deployment

### Build for Production

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up --build
```

## 📦 Dependencies

### Backend
- Express.js, MongoDB/Mongoose, JWT, Socket.IO, Helmet, Morgan, etc.

### Frontend
- React, Redux Toolkit, Axios, Socket.IO Client, React Router, etc.

For detailed dependencies, see [Backend package.json](backend/package.json) and [Frontend package.json](frontend/package.json).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💡 Best Practices Implemented

- ✅ RESTful API design
- ✅ Component-based architecture
- ✅ Type-safe TypeScript throughout
- ✅ Redux state management
- ✅ Protected routes and endpoints
- ✅ Error handling and logging
- ✅ Code organization and structure
- ✅ Environment configuration
- ✅ Docker containerization
- ✅ Security best practices
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Database indexing for performance

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- JWT authentication
- Real-time communication with Socket.IO
- Redux state management
- TypeScript best practices
- Docker containerization
- RESTful API design
- MongoDB schema design
- Responsive web design

Perfect for portfolio projects and showcasing full-stack development skills.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy task managing!** 📝✨
