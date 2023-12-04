// src/routes/tasks.ts

import express, { Request, Response } from 'express';
import TaskModel from '../models/Task';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Middleware to check user authentication
router.use(authenticateUser);

interface MiddleawreRequest extends Request {
  user?: any; // Change 'any' to the actual type of your user object if available
}

// Get tasks with optional filters, pagination, and search
router.get('/', async (req: MiddleawreRequest, res: Response) => {
  try {
    const { status, priority, page, limit, query } = req.query;

    // Construct the base query
    const baseQuery: any = { createdBy: req.user.userId };

    // Add optional filters
    if (status) baseQuery.status = status;
    if (priority) baseQuery.priority = priority;

    // Add search query
    if (query) {
      baseQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Perform the query with optional pagination
    const tasksQuery = TaskModel.find(baseQuery);

    if (page && limit) {
      const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
      tasksQuery.skip(skip).limit(parseInt(limit.toString()));
    }

    const tasks = await tasksQuery.exec();

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a specific task
router.get('/:taskId', async (req: MiddleawreRequest, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await TaskModel.findOne({
      _id: taskId,
      createdBy: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Exclude createdBy field from the response
    const sanitizedTask = { ...task.toObject(), createdBy: undefined };
    res.json(sanitizedTask);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new task
router.post('/', async (req: MiddleawreRequest, res: Response) => {
  const { title, description, status, priority } = req.body;

  try {
    // Create a new task associated with the authenticated user
    const newTask = new TaskModel({
      title,
      description,
      status,
      priority,
      createdBy: req.user.userId
    });

    const savedTask = await newTask.save();
    // Exclude createdBy field from the response
    const sanitizedTask = { ...savedTask.toObject(), createdBy: undefined };

    res.status(201).json(sanitizedTask);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a task
router.put('/:taskId', async (req: MiddleawreRequest, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      {
        _id: taskId,
        createdBy: req.user.userId
      },
      { title, description, status, priority },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Exclude createdBy field from the response
    const sanitizedTask = { ...updatedTask.toObject(), createdBy: undefined };

    res.json(sanitizedTask);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task by ID
router.delete('/:taskId', async (req: MiddleawreRequest, res: Response) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await TaskModel.findOneAndDelete({
      _id: taskId,
      createdBy: req.user.userId
    });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
