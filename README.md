# Traffic Monitoring System Backend

A real-time traffic monitoring system backend built with Node.js, Express, MongoDB, and Socket.IO. This backend provides APIs for traffic data and alerts, as well as real-time updates via WebSockets.

## System Overview

The Traffic Monitoring System backend is designed to:
- Collect and store traffic data from various road segments
- Generate and manage traffic alerts
- Provide real-time updates to connected clients via WebSockets
- Offer a RESTful API for data access

## Tech Stack

- **Node.js & TypeScript**: Core runtime and language
- **Express**: Web framework for API endpoints
- **MongoDB**: Database for storing traffic data and alerts
- **Socket.IO**: Real-time bidirectional communication
- **MQTT**: Protocol for sensor data communication
- **Swagger**: API documentation

## API Routes

### Traffic Routes (`/api/traffic`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/traffic` | Get recent traffic data (last 100 records) |
| POST   | `/api/traffic` | Add new traffic data |

### Alert Routes (`/api/alerts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/alerts` | Get all traffic alerts |
| POST   | `/api/alerts` | Create a new traffic alert |
| POST   | `/api/alerts/:id/resolve` | Mark an alert as resolved |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `traffic_update` | Server → Client | Emitted when new traffic data is received |
| `traffic_alert` | Server → Client | Emitted when a new alert is created |
| `alert_resolved` | Server → Client | Emitted when an alert is resolved |

## Data Models

### Traffic Model

```typescript
{
  roadSegmentId: string;
  timestamp: Date;
  vehicleCount: number;
  averageSpeedKph: number;
  congestionLevel: 'low' | 'medium' | 'high';
}
```

### Traffic Alert Model

```typescript
{
  type: 'accident' | 'construction' | 'congestion' | 'weather' | 'event';
  severity: 'low' | 'moderate' | 'high';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  estimatedDelay: string;
  isRead: boolean;
  status: 'active' | 'resolved';
}
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or remote)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/traffic-monitoring
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Installation Steps

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

## Running the Simulators

The system includes two simulators to help with development and testing:

### MQTT Publisher Simulator

Simulates traffic sensors publishing data via MQTT:

```bash
npx ts-node ./simulate/mqttPublisher.ts
```

This simulator publishes random traffic data to the MQTT topic `kigali/traffic` every 15 seconds.

### Sensor Feed Simulator

Simulates direct API calls to the backend with traffic data:

```bash
npx ts-node ./simulate/sensorFeed.ts
```

This simulator sends HTTP POST requests with random traffic data to the backend every 10 seconds.

## Development Workflow

1. Start the backend server:
   ```bash
   npm run dev
   ```
2. Start the simulators in separate terminal windows:
   ```bash
   npx ts-node ./simulate/mqttPublisher.ts
   npx ts-node ./simulate/sensorFeed.ts
   ```
3. Access the API documentation at `http://localhost:5000/api-docs`

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the documentation at:

```
http://localhost:5000/api-docs
```

## Troubleshooting

- If you encounter connection issues with MongoDB, verify your connection string in the `.env` file
- Make sure the port specified in your `.env` file is available
- Check that all dependencies are installed correctly with `npm install`