import { Schema, model, Document } from 'mongoose';

interface ILeaderboardEntry {
  userId: Schema.Types.ObjectId;
  username: string;
  score: number;
  achievements: number;
  fastestCompletion?: number;
}

interface ILeaderboard extends Document {
  type: 'global' | 'planet' | 'weekly';
  planetId?: Schema.Types.ObjectId; // Optional based on the 'type'
  entries: ILeaderboardEntry[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  type: {
    type: String,
    required: true,
    enum: ['global', 'planet', 'weekly'],
  },
  planetId: {
    type: Schema.Types.ObjectId,
    ref: 'Planet',
    required: function (this: ILeaderboard) {
      return this.type === 'planet'; // Only required if type is 'planet'
    },
  },
  entries: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    achievements: {
      type: Number,
      default: 0,
    },
    fastestCompletion: {
      type: Number, // in seconds
    },
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for quick querying
LeaderboardSchema.index({ type: 1, startDate: 1, endDate: 1 });
LeaderboardSchema.index({ 'entries.score': -1 });
LeaderboardSchema.index({ isActive: 1 });
LeaderboardSchema.index({ planetId: 1 }, { sparse: true }); // Index planetId for efficient querying

// Ensure entries are sorted by score
LeaderboardSchema.pre('save', function(next) {
  this.entries.sort((a, b) => b.score - a.score); // Sort entries by score descending
  next();
});

export const Leaderboard = model<ILeaderboard>('Leaderboard', LeaderboardSchema);
