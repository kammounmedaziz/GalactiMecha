import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  spacecraftId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  temperature: {
    type: Number,
    required: true
  },
  pressure: {
    type: Number,
    required: true
  },
  batteryLevel: {
    type: Number,
    required: true
  },
  position: {
    type: [Number],
    required: true
  },
  velocity: {
    type: [Number],
    required: true
  }
});

const Telemetry = mongoose.model('Telemetry', telemetrySchema);

export default Telemetry;