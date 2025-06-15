// backend/docs/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart City Traffic API',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Traffic: {
          type: 'object',
          properties: {
            roadSegmentId: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            vehicleCount: { type: 'number' },
            averageSpeedKph: { type: 'number' },
            congestionLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
          required: ['roadSegmentId', 'vehicleCount', 'averageSpeedKph', 'congestionLevel']
        },
        TrafficData: {
          type: 'object',
          properties: {
            currentSpeed: { type: 'number' },
            averageSpeed: { type: 'number' },
            congestionLevel: { type: 'string', enum: ['low', 'moderate', 'high'] },
            estimatedDelay: { type: 'number' },
            activeAlerts: { type: 'number' },
          },
          required: ['currentSpeed', 'averageSpeed', 'congestionLevel', 'estimatedDelay', 'activeAlerts']
        },
        SensorReading: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            vehicleCount: { type: 'number' },
            averageSpeed: { type: 'number' },
            densityLevel: { type: 'number' },
          },
          required: ['timestamp', 'vehicleCount', 'averageSpeed', 'densityLevel']
        }
      }
    }
  },
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
