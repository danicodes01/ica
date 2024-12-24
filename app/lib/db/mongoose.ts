import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string; // Type assertion

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));