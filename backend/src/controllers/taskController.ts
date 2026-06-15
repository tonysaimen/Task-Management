import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { emitTaskCreated, emitTaskUpdated, emitTaskDeleted } from '../socket/socketHandler';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, search, sort = '-createdAt' } = req.query;
    const userId = req.user?.id;

    let query: any = { createdBy: userId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption = typeof sort === 'string' ? sort : '-createdAt';
    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sortOption)
      .lean();

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate, status, assignedTo, tags } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      dueDate,
      status: status || 'pending',
      createdBy: req.user?.id,
      assignedTo,
      tags: tags || [],
    });

    const populatedTask = await task.populate('createdBy', 'name email');
    emitTaskCreated(populatedTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.author', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, status, assignedTo, tags } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;
    if (tags) task.tags = tags;

    await task.save();
    const updatedTask = await task.populate('createdBy', 'name email');
    emitTaskUpdated(updatedTask);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(id);
    emitTaskDeleted(id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};
