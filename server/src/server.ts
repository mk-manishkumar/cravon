import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Cravon Server is running!' });
});

// Database Connection & Server Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  });
