import mongoose from 'mongoose';
import { dbUrl } from './dotenv.js';

async function connectDB() {
  try {
    await mongoose.connect(dbUrl, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Keep service alive in local/dev mode so non-DB parts can still run.
  }
}

export default connectDB;
