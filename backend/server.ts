import app from './src/app';
import connectDatabase from './src/config/database';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`LionStock API is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });