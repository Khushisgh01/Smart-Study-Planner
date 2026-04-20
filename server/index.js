import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import taskRoutes from './routes/tasks.js';
import classRoutes from './routes/class.js';

dotenv.config();
connectDB();

const app = express();

// Bug 14: explicit CORS config allowing the Vite frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Bug 14: body-parser (express.json) must be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/class', classRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));