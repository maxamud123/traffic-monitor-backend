// backend/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import trafficRoutes from './routes/traffic.routes';
import alertRoutes from './routes/alerts.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger';
import { Server } from "socket.io";
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server attached to the HTTP server
const io = new Server(server, { 
  cors: { origin: '*', methods:['GET', 'POST'] }
});

// Make io available to routes
app.set('io', io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set up socket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});