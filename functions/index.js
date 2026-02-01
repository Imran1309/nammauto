import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
// The rewrite in firebase.json will ideally direct /api/... to this function.
// Express will see the full path.
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI is missing in environment variables!");
}

// Connect to MongoDB
// Mongoose manages connection pooling, so we can call this at the top level.
// However, to ensure it doesn't hang deployment if fails, we catch.
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

export const api = onRequest(app);
