import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    passengerId: { type: String, required: true },
    passengerName: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    vehicle: { type: String, required: true },
    type: { type: String, default: 'drop_off' },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'completed', 'cancelled'] },
    driverId: { type: String, default: null },
    price: { type: String, default: null },
    distance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ride', RideSchema);
