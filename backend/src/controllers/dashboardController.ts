import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const totalTasks = await Task.countDocuments({ createdBy: userId });
    const completedTasks = await Task.countDocuments({
      createdBy: userId,
      status: 'completed',
    });
    const inProgressTasks = await Task.countDocuments({
      createdBy: userId,
      status: 'in-progress',
    });
    const pendingTasks = await Task.countDocuments({
      createdBy: userId,
      status: 'pending',
    });

    const highPriorityTasks = await Task.countDocuments({
      createdBy: userId,
      priority: 'high',
      status: { $ne: 'completed' },
    });

    const overdueTasks = await Task.countDocuments({
      createdBy: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
    });

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        highPriorityTasks,
        overdueTasks,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const recentTasks = await Task.find({ createdBy: userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email')
      .lean();

    res.json({
      success: true,
      data: recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent activity', error });
  }
};

import mongoose from 'mongoose';

export const getTasksOverview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const tasksByStatus = await Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        byStatus: tasksByStatus,
        byPriority: tasksByPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks overview', error });
  }
};
