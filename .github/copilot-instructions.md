# Task Management Application - Development Instructions

## Project Overview
A full-stack Task Management Web Application with React frontend, Node.js/Express backend, MongoDB database, JWT authentication, and Socket.IO real-time updates.

## Tech Stack
- **Frontend**: React 18, TypeScript, Redux Toolkit, Axios, Socket.IO Client
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- **Database**: MongoDB (Local or Atlas)
- **Deployment**: Docker-ready configuration

## Setup Instructions

### Backend Setup
1. Navigate to `backend` folder
2. Run `npm install`
3. Create `.env` file with MongoDB and JWT configuration
4. Run `npm run dev` to start development server (port 5000)

### Frontend Setup
1. Navigate to `frontend` folder
2. Run `npm install`
3. Run `npm start` to start development server (port 3000)

### Docker Setup
Run `docker-compose up` to start all services (MongoDB, Backend, Frontend)

## Project Structure
- `/backend` - Express server, models, routes, controllers
- `/frontend` - React application with components, pages, state management
- `/backend/src/models` - Database schemas
- `/backend/src/routes` - API route definitions
- `/backend/src/controllers` - Business logic
- `/backend/src/middleware` - Authentication and validation middleware
- `/frontend/src/components` - Reusable React components
- `/frontend/src/pages` - Page components
- `/frontend/src/store` - Redux store configuration

## Development Guidelines
- Use TypeScript for type safety
- Follow RESTful API design patterns
- Implement proper error handling
- Add validation on both client and server
- Use environment variables for configuration
- Follow security best practices (CORS, rate limiting, input validation)

## API Documentation
See `/backend/README.md` for detailed API endpoints.

## Building & Deployment
- Backend: `npm run build` → `npm run start`
- Frontend: `npm run build` → deployed static files
- Docker: `docker-compose -f docker-compose.prod.yml up`
