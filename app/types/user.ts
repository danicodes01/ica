import { Document, Model, Types } from 'mongoose';

export interface Currency {
  lunar: number;
  chromanova: number;
  syntaxia: number;
  quantum: number;
  galactic: number;
}

export interface IUser {
  email: string;
  name: string;
  image?: string;
  emailVerified?: Date;
  password: string;
  totalXP: number;
  totalCurrency: Currency;

  currentPlanet: {
    planetId: Types.ObjectId;
    currentStation: number;
    completedStations: number[];
  };

  planetProgress: Array<{
    planetId: Types.ObjectId;
    isUnlocked: boolean;
    isCompleted: boolean;
    totalXPEarned: number;
  }>;
}

// andle currency updates
export interface IUserMethods {
  addXP(amount: number): Promise<number>;
  canAccessStation(
    planetId: Types.ObjectId,
    stationNumber: number,
  ): Promise<boolean>;
  completeStation(
    planetId: Types.ObjectId,
    stationNumber: number,
    earnedXP: number,
  ): Promise<void>;
  // Add new method for currency
  addCurrency(type: keyof Currency, amount: number): Promise<number>;
}

export interface IUserDocument
  extends Document<Types.ObjectId>,
    IUser,
    IUserMethods {}

export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
  findByEmail(email: string): Promise<IUserDocument | null>;
}
