import { Schema, model } from 'mongoose';

const StationProgressSchema = new Schema({
  stationNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  completed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date
  },
  bestTime: {
    type: Number  // in seconds
  }
});

const PlanetProgressSchema = new Schema({
  planetId: {
    type: Schema.Types.ObjectId,
    ref: 'Planet',
    required: true
  },
  currentStation: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  stationProgress: [StationProgressSchema],
  currency: {
    type: Number,
    default: 0
  }
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  planetProgress: [PlanetProgressSchema],
  xp: {
    type: Number,
    default: 0
  },
  level: { // should be tied to station
    type: Number,
    default: 1
  },
  totalCurrency: {
    lunar: { type: Number, default: 0 },
    venus: { type: Number, default: 0 },
    saturn: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for frequent queries
UserSchema.index({ 'planetProgress.planetId': 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export const User = model('User', UserSchema);