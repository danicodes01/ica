import { Schema, model, Document } from 'mongoose';
import { ModuleStatus } from '../app/types/planet';
import { 
  NPCType, 
  StationEnvironment, 
  IStationDocument, 
  IStationModel,
  IStation,
  IStationMethods
} from '../app/types/station';

type StationWithMethods = Document & IStation & IStationMethods;

const StationSchema = new Schema(
  {
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
    environment: {
      type: String,
      enum: Object.values(StationEnvironment),
      required: true
    },
    npc: {
      type: {
        type: String,
        enum: Object.values(NPCType),
        required: true
      },
      name: { type: String, required: true },
      dialogue: {
        greeting: { type: String, required: true },
        hint: { type: String, required: true },
        success: { type: String, required: true },
        failure: { type: String, required: true }
      },
      appearance: { type: String, required: true }
    },
    challenge: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      difficulty: { type: String, required: true },
      initialCode: { type: String, required: true },
      solution: { type: String, required: true },
      examples: { type: String },
      testCases: [{
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true }
      }],
      hints: [{ type: String }],
      baseXPReward: { type: Number, required: true },
      xpDecayFactor: { type: Number, default: 0.8 }
    },
    progress: {
      currentCode: { type: String },
      attempts: [{ 
        timestamp: { type: Date },
        code: { type: String },
        passed: { type: Boolean },
        earnedXP: { type: Number }
      }],
      bestAttempt: {
        attemptNumber: { type: Number },
        earnedXP: { type: Number }
      },
      isComplete: { type: Boolean, default: false }
    },
    completionStatus: {
      type: String,
      enum: Object.values(ModuleStatus),
      default: ModuleStatus.LOCKED,
      required: true
    },
    requiredStations: [{
      type: Schema.Types.ObjectId,
      ref: 'Station'
    }],
    theme: {
      backgroundColor: { type: String },
      ambientSound: { type: String },
      specialEffects: [{ type: String }],
      planetStyle: {
        type: String,
        enum: ['chromanova', 'syntaxia', 'quantumcore', 'mission-control'],
        required: true
      },
      glowColor: { type: String },
      backgroundStars: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

// Compound index to ensure unique station numbers per planet
StationSchema.index({ planetId: 1, stationNumber: 1 }, { unique: true });

// Method to calculate XP based on attempt number
StationSchema.methods.calculateXP = function(this: IStationDocument, attemptNumber: number): number {
  const baseXP = this.challenge.baseXPReward;
  const decayFactor = this.challenge.xpDecayFactor;
  return Math.floor(baseXP * Math.pow(decayFactor, attemptNumber - 1));
};

// Method to check if station is accessible
StationSchema.methods.isAccessible = async function(this: IStationDocument): Promise<boolean> {
  if (this.stationNumber === 1) return true;
  
  // Add proper typing here
  const previousStation = await this.model('Station').findOne({
    planetId: this.planetId,
    stationNumber: this.stationNumber - 1
  }).lean() as IStationDocument | null;  // Add explicit typing
  
  return Boolean(previousStation?.progress.isComplete);
};

// Static method to get station progress
StationSchema.static('getProgress', async function(
  planetId: string
): Promise<Array<{
  stationNumber: number;
  isComplete: boolean;
  bestAttempt: {
    attemptNumber: number;
    earnedXP: number;
  } | null;
  isAccessible: boolean;
}>> {
  const stations = await this.find({ planetId })
    .sort('stationNumber')
    .exec() as unknown as StationWithMethods[];
  
  if (!stations.length) {
    return [];
  }

  return Promise.all(stations.map(async (station) => ({
    stationNumber: station.stationNumber,
    isComplete: station.progress.isComplete,
    bestAttempt: station.progress.bestAttempt,
    isAccessible: await station.isAccessible()
  })));
});

// Export the model
export const Station = model<IStationDocument, IStationModel>('Station', StationSchema);