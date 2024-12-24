import { Schema, model } from 'mongoose';

const StationSchema = new Schema({
  planetId: {
    type: Schema.Types.ObjectId,
    ref: 'Planet',
    required: true
  },
  stationNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  name: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  npc: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    dialogue: {
      intro: { type: String, required: true },
      success: { type: String, required: true },
      failure: { type: String, required: true },
      hint: { type: String, required: true }
    },
    avatarUrl: { type: String, required: true }
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'CodingChallenge',
    required: true
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  rewards: {
    baseXP: { type: Number, required: true },
    baseCurrency: { type: Number, required: true }
  },
  isFirstStation: {
    type: Boolean,
    default: false
  },
  attemptRules: {
    maxAttempts: {
      type: Number,
      default: 3
    },
    cooldownPeriod: {
      type: Number,
      default: 6,  // hours
      min: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for planet and station number
StationSchema.index({ planetId: 1, stationNumber: 1 }, { unique: true });

// Helper method to check if attempts are allowed
StationSchema.methods.canAttempt = function(attempts: number, lastAttemptAt: Date | null): boolean {
  // First station has unlimited attempts
  if (this.isFirstStation) return true;
  
  // Check attempt count
  if (attempts >= this.attemptRules.maxAttempts) {
    // Check cooldown period if max attempts reached
    if (lastAttemptAt) {
      const hoursSinceLastAttempt = (Date.now() - lastAttemptAt.getTime()) / (1000 * 60 * 60);
      return hoursSinceLastAttempt >= this.attemptRules.cooldownPeriod;
    }
    return false;
  }
  
  return true;
};

export const Station = model('Station', StationSchema);