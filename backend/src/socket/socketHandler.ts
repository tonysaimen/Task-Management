import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface SocketUser {
  userId: string;
  socketId: string;
}

let connectedUsers: SocketUser[] = [];
let io: Server | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`✓ User connected: ${socket.id}`);

    socket.on('user:connect', (userId: string) => {
      connectedUsers.push({ userId, socketId: socket.id });
      io?.emit('users:online', connectedUsers);
    });

    socket.on('task:created', (task) => {
      io?.emit('task:created', task);
    });

    socket.on('task:updated', (task) => {
      io?.emit('task:updated', task);
    });

    socket.on('task:deleted', (taskId) => {
      io?.emit('task:deleted', taskId);
    });

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
      io?.emit('users:online', connectedUsers);
      console.log(`✗ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitTaskCreated = (task: any) => {
  io?.emit('task:created', task);
};

export const emitTaskUpdated = (task: any) => {
  io?.emit('task:updated', task);
};

export const emitTaskDeleted = (taskId: string) => {
  io?.emit('task:deleted', taskId);
};
