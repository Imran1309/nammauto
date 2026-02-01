
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

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    await connectDB();
    next();
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

export default app;
