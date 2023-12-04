// src/index.ts

import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import taskRoutes from './routes/tasks'; // Import the task routes
import userRoutes from './routes/user'; // Import the task routes
import authRoutes from './routes/auth'; // Import the auth routes

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'tryhackme';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (_: Request, res: Response) => {
  res.send('Hello, World!');
});

// Mount task routes
app.use('/auth', authRoutes); // Mount auth routes
app.use('/tasks', taskRoutes); // Mount tasks routes
app.use('/user', userRoutes); // Mount user routes

// Connect to MongoDB
mongoose
  .connect(`${MONGO_URI}/${MONGO_DB_NAME}`, {})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after connecting to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));
