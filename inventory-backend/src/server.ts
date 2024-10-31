import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.substring(0, 20) + '...');

    await mongoose.connect(process.env.MONGODB_URI!);
    
    console.log('\n🌿 MongoDB Connection Status:');
    console.log('✅ Successfully connected to MongoDB');
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔌 Host: ${mongoose.connection.host}`);

    // Test database connection
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app; 