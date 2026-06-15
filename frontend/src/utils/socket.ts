import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket) return socket;

  socket = io(BACKEND_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connect error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export const emitUserConnected = (userId: string) => {
  if (!socket) return;
  socket.emit('user:connect', userId);
};

export const emitTaskCreated = (task: any) => {
  if (!socket) return;
  socket.emit('task:created', task);
};

export const emitTaskUpdated = (task: any) => {
  if (!socket) return;
  socket.emit('task:updated', task);
};

export const emitTaskDeleted = (taskId: string) => {
  if (!socket) return;
  socket.emit('task:deleted', taskId);
};

export const subscribeToTaskEvents = (
  onCreated: (task: any) => void,
  onUpdated: (task: any) => void,
  onDeleted: (taskId: string) => void
) => {
  if (!socket) return;
  socket.on('task:created', onCreated);
  socket.on('task:updated', onUpdated);
  socket.on('task:deleted', onDeleted);
};

export const unsubscribeFromTaskEvents = () => {
  if (!socket) return;
  socket.off('task:created');
  socket.off('task:updated');
  socket.off('task:deleted');
};

export const subscribeToPresence = (onUsersOnline: (users: any[]) => void) => {
  if (!socket) return;
  socket.on('users:online', onUsersOnline);
};

export const unsubscribeFromPresence = () => {
  if (!socket) return;
  socket.off('users:online');
};
