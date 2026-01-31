import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Attempting to connect...");

mongoose.set('debug', true);

try {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Fail fast
    });
    console.log("SUCCESS: MongoDB Connected");
    process.exit(0);
} catch (err) {
    console.error("FAILURE: Connection Error");
    console.error(err.name);
    console.error(err.message);
    // console.error(err); // Too verbose to dump everything
    process.exit(1);
}
