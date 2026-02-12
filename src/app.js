import dotenv from 'dotenv';
dotenv.config(); // PRIMERO DE TODO

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import twilioRoutes from './routes/twilioRoutes.js';

const app = express();

// Middleware
app.use(morgan('dev'));

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/twilio', twilioRoutes);

export default app;