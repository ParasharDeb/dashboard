import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dashboard_db';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Direct MongoDB connection failed (${connUri}).`);
    console.warn('The API will serve requests with mock/memory fallback if MongoDB is unreachable.');
  }
};
