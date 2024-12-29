import { Schema, Types, model, models } from 'mongoose';
import { Currency, IUserDocument, IUserModel } from '../app/types/user';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    emailVerified: Date,
    password: { type: String, required: true, select: false },

    totalXP: {
      type: Number,
      default: 0,
    },

    totalCurrency: {
      lunar: { type: Number, default: 0 },
      chromanova: { type: Number, default: 0 },
      syntaxia: { type: Number, default: 0 },
      quantum: { type: Number, default: 0 },
      galactic: { type: Number, default: 0 },
    },

    currentPlanet: {
      planetId: {
        type: Schema.Types.ObjectId,
        ref: 'Planet',
      },
      currentStation: {
        type: Number,
        default: 1,
      },
      completedStations: [
        {
          type: Number,
        },
      ],
    },

    planetProgress: [
      {
        planetId: {
          type: Schema.Types.ObjectId,
          ref: 'Planet',
        },
        isUnlocked: {
          type: Boolean,
          default: false,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        totalXPEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// Check if model is already registered, and only register if it isn't
const User = models.User || model<IUserDocument, IUserModel>('User', UserSchema);

UserSchema.static('findByEmail', function (email: string) {
  return this.findOne({ email });
});

UserSchema.methods.addCurrency = async function (
  type: keyof Currency,
  amount: number,
): Promise<number> {
  this.totalCurrency[type] += amount;
  await this.save();
  return this.totalCurrency[type];
};

UserSchema.methods.completeStation = async function (
  planetId: Types.ObjectId,
  stationNumber: number,
  earnedXP: number,
  earnedCurrency?: { type: keyof Currency; amount: number },
): Promise<void> {
  if (!this.currentPlanet.completedStations.includes(stationNumber)) {
    this.currentPlanet.completedStations.push(stationNumber);
  }

  const planetProgress = this.planetProgress.find(
    (p: {
      planetId: Types.ObjectId;
      isUnlocked: boolean;
      isCompleted: boolean;
      totalXPEarned: number;
    }) => p.planetId.equals(planetId),
  );

  if (planetProgress) {
    planetProgress.totalXPEarned += earnedXP;
  }

  await this.addXP(earnedXP);

  if (earnedCurrency) {
    await this.addCurrency(earnedCurrency.type, earnedCurrency.amount);
  }

  await this.save();
};

export { User };
