import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';

import { connectDB } from './config/database';
import { errorHandler } from './shared/middleware/error.middleware';

// Routes
import authRouter from './modules/auth/auth.router';
import projectRouter from './modules/projects/project.router';
import taskRouter from './modules/tasks/task.router';
import teamRouter from './modules/teams/team.router';
import usersRouter from './modules/users/users.router';

// Load environment variables
config();

// Create Express app
const app: Express = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/projects/:projectId/tasks', taskRouter);
app.use('/api/teams', teamRouter);
app.use('/api/users', usersRouter);

// Error handling - must be after routes
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
