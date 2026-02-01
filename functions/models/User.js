import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'driver'], default: 'user' },
    vehicleDetails: {
        type: Object,
        default: null
    },
    status: { type: String, default: 'offline' }, // for drivers
    location: { type: String, default: 'Unknown' },
    rating: { type: Number, default: 5.0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
