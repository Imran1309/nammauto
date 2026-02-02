
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rides.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Connect immediately when server starts
connectDB();

// Middleware to ensure DB connection on every request (useful for serverless cold starts)
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState >= 1) {
        return next();
    }
    await connectDB();
    next();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
