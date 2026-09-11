import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const connectMongoDB = async () => {
    try {
        const user = requireEnv('MONGODB_USERNAME');
        const password = requireEnv('MONGODB_PASSWORD');
        const url = requireEnv('MONGODB_URL');
        const port = requireEnv('MONGO_PORT');
        const database = requireEnv('MONGODB_DATABASE');
        const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';

        const uri = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${url}:${port}/${database}?authSource=${authSource}`;

        await mongoose.connect(uri);

        console.log(`MongoDB ${url}:${port} conectado ao banco ${database}`);   
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
