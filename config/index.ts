import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'PORT', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const config = {
  port: parseInt(process.env.PORT as string, 10) || 5000,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8081', 'http://localhost:3000', 'exp://localhost:8081'],
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};

export default config;
