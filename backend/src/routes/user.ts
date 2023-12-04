// src/routes/tasks.ts

import express, { Request, Response } from 'express';
import UserModel from '../models/User';
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
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
