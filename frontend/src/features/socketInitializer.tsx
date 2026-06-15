import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppHooks';
import { connectSocket, disconnectSocket, emitUserConnected, subscribeToTaskEvents, unsubscribeFromTaskEvents, subscribeToPresence, unsubscribeFromPresence } from '../utils/socket';
import { useAppDispatch } from '../hooks/useAppHooks';
import { taskCreated, taskUpdated, taskDeleted } from '../store/taskSlice';
import { setOnlineUsers } from '../store/dashboardSlice';

const SocketInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    const socket = connectSocket(token);
    emitUserConnected(user.id);

    subscribeToTaskEvents(
      (task) => {
        console.log('task created via socket', task);
        dispatch(taskCreated(task));
      },
      (task) => {
        console.log('task updated via socket', task);
        dispatch(taskUpdated(task));
      },
      (taskId) => {
        console.log('task deleted via socket', taskId);
        dispatch(taskDeleted(taskId));
      }
    );

    subscribeToPresence((users) => {
      dispatch(setOnlineUsers(users.length));
    });

    return () => {
      unsubscribeFromTaskEvents();
      unsubscribeFromPresence();
      disconnectSocket();
    };
  }, [dispatch, token, user]);

  return null;
};

export default SocketInitializer;
