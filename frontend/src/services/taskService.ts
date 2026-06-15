import apiClient from '../utils/apiClient';
import { Task } from '../types';

export const taskService = {
  getTasks: async (filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    const response = await apiClient.get('/tasks', { params: filters });
    return response.data;
  },

  createTask: async (taskData: Partial<Task>) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/dashboard/activity');
    return response.data;
  },

  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },
};
