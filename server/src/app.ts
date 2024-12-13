import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cron from 'node-cron';
import axios from 'axios';
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
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://my-pms.vercel.app', // Replace with your actual Vercel frontend domain
    "*"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
// app.use('/api/projects/:projectId/tasks', taskRouter);
app.use('/api/teams', teamRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', usersRouter);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});



// Error handling - must be after routes
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
cron.schedule('*/3 * * * *', async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/`);
    console.log(`Server health check at ${new Date().toISOString()}: ${response.status}`);
  } catch (error) {
    console.error('Server health check failed:', error);
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
