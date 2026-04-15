import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import trafficRoutes from './routes/traffic.routes';
import alertRoutes from './routes/alerts.routes';
import swaggerDocs from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO with restricted CORS
const io = new Server(server, {
  cors: {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Make io available to routes
app.set('io', io);

// Middleware
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// MongoDB with proper error handling
mongoose
  .connect(config.mongoUri, { maxPoolSize: 10, minPoolSize: 2 })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Request timeout
server.setTimeout(30000);

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
