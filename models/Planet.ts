import { Schema, model } from 'mongoose';
import { ModuleStatus } from '../app/types/planet';


const PlanetSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['chromanova', 'syntaxia', 'quantumcore', 'mission-control'],
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      radius: { type: Number, required: true },
    },
    learningPath: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      modules: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          difficulty: { type: String, required: true },
          challenges: [{ type: String, required: true }],
          xpReward: { type: Number, required: true },
          completionStatus: { type: String, enum: Object.values(ModuleStatus), required: true },
        },
      ],
      totalXP: { type: Number, required: true },
    },
    isUnlocked: { type: Boolean, default: false },
    requiredPlanets: [{ type: Schema.Types.ObjectId, ref: 'Planet' }],
  },
  { timestamps: true }
);

export const Planet = model('Planet', PlanetSchema);
