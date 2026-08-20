import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const MONGODB_URI = process.env.MONGODB_URI;

const connectDatabase = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  await mongoose.connect(MONGODB_URI);

  console.log('MongoDB conectado com sucesso!');
};

export default connectDatabase;