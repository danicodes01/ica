import { Schema, model } from 'mongoose';

const AchievementSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'speed',           // Time-based achievements
      'completion',      // Finishing content
      'mastery',         // Skill demonstration
      'exploration',     // Discovering content
      'social',          // Community interaction
      'collection',      // Gathering resources
      'challenge'        // Special tasks
    ]
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: [
        'challengesCompleted',
        'stationsVisited',
        'planetsExplored',
        'currencyEarned',
        'timeSpent',
        'perfectSolutions',
        'firstTryCompletions',
        'hintsUsed',
        'totalXP'
      ]
    },
    value: {
      type: Number,
      required: true
    }
  },
  reward: {
    xp: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: {
        type: String,
        required: true,
        enum: ['lunar', 'venus', 'saturn', 'galactic']
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      }
    },
    badge: {
      name: String,
      imageUrl: String,
      rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary']
      }
    }
  },
  tier: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  prerequisiteAchievements: [{
    type: Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  planetRequirement: {
    type: Schema.Types.ObjectId,
    ref: 'Planet'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for frequent queries
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ tier: 1 });
AchievementSchema.index({ isActive: 1 });

export const Achievement = model('Achievement', AchievementSchema);