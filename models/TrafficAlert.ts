// backend/models/TrafficAlert.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficAlert extends Document {
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

const TrafficAlertSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['accident', 'construction', 'congestion', 'weather', 'event'] },
  severity: { type: String, required: true, enum: ['low', 'moderate', 'high'] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  estimatedDelay: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
});

const TrafficAlert = mongoose.model<ITrafficAlert>('TrafficAlert', TrafficAlertSchema);
export default TrafficAlert;