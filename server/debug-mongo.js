import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Attempting to connect...");

mongoose.set('debug', true);

import fs from 'fs';

try {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Fail fast
    });
    console.log("SUCCESS: MongoDB Connected");
    fs.writeFileSync('server/mongo-error.txt', 'SUCCESS');
    process.exit(0);
} catch (err) {
    console.error("FAILURE: Connection Error");
    console.error(err.name);
    console.error(err.message);
    fs.writeFileSync('server/mongo-error.txt', `FAILURE: ${err.name} - ${err.message}`);
    process.exit(1);
}
