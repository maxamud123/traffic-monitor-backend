import mongoose, { Document, Schema } from 'mongoose';

export interface ITraffic extends Document {
  roadSegmentId: string;
  timestamp: Date;
  vehicleCount: number;
  averageSpeedKph: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

const TrafficSchema: Schema = new Schema({
  roadSegmentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  vehicleCount: { type: Number, required: true },
  averageSpeedKph: { type: Number, required: true },
  congestionLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
});

// Indexes for fast queries
TrafficSchema.index({ timestamp: -1 });
TrafficSchema.index({ roadSegmentId: 1, timestamp: -1 });

export default mongoose.model<ITraffic>('Traffic', TrafficSchema);
