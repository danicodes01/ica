"use server"
import {User} from "../models/User";
import bcrypt from "bcryptjs";


  export const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { error: "Email is already in use" };
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
      });
  
      // Save user to DB
      const savedUser = await newUser.save();
  
      // Serialize the user data (convert ObjectId to string)
      const serializedUser = {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
      };
  
      return { user: serializedUser };  // Return the serialized user object
    } catch (error) {
      console.error("Error registering user:", error);
      return { error: "An error occurred during registration" };
    }
  };