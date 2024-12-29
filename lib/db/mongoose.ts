import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string; // Type assertion

let isConnected = false; // To track the connection status

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;
