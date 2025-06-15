// backend/models/Traffic.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITraffic extends Document {
  roadSegmentId: string;
  timestamp: Date;
  vehicleCount: number;
  averageSpeedKph: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface TrafficData {
  currentSpeed: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'moderate' | 'high';
  estimatedDelay: number;
  activeAlerts: number;
}

export interface SensorReading {
  timestamp: Date;
  vehicleCount: number;
  averageSpeed: number;
  densityLevel: number;
}

const TrafficSchema: Schema = new Schema({
  roadSegmentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  vehicleCount: { type: Number, required: true },
  averageSpeedKph: { type: Number, required: true },
  congestionLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
});

export default mongoose.model<ITraffic>('Traffic', TrafficSchema);
