import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app: Application = express();

// Security: Disable X-Powered-By header (SonarLint: typescript:S5689)
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
// Enable Cross-Origin Resource Sharing for the React Client (SonarLint: typescript:S5122)
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json()); 

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true })); 


// ==========================================
// 2. ROUTES
// ==========================================
// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Cravon API is up and running!' });
});

// NOTE: Import and use your route files here as you build them.
// Note: Because we are using ES Modules ("type": "module"), ensure your local imports end with .js!
//
// Example:
// import authRoutes from './routes/authRoutes.js';
// app.use('/api/auth', authRoutes);
// 
// import restaurantRoutes from './routes/restaurantRoutes.js';
// app.use('/api/restaurants', restaurantRoutes);


// ==========================================
// 3. ERROR HANDLING
// ==========================================
// 404 Route Not Found Middleware - Catches requests to undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found on the server.`
  });
});

// Global Error Handler Middleware - Catches errors thrown anywhere in the app
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Only show error stack traces in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


// ==========================================
// 4. DATABASE CONNECTION & SERVER START
// ==========================================
// Using top-level await (SonarLint: typescript:S7785)
try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB Connected successfully.');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ MongoDB Connection Error:', error);
  process.exit(1);
}
