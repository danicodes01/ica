"use server"
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongoose";

export const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      totalXP: 0,
      totalCurrency: {
        lunar: 0,
        chromanova: 0,
        syntaxia: 0,
        quantum: 0,
        galactic: 0
      },
      currentPlanet: {
        currentStation: 1,
        completedStations: []
      },
      planetProgress: []
    });

    const savedUser = await newUser.save();

    const serializedUser = {
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name
    };

    return { user: serializedUser };
  } catch (error) {
    console.error("Error registering user:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An error occurred during registration" };
  }
};