
import express from 'express';
const router = express.Router();
import Ride from '../models/Ride.js';

// Create a ride request
router.post('/', async (req, res) => {
    try {
        const ride = new Ride({
            ...req.body,
            status: 'pending'
        });
        const savedRide = await ride.save();
        res.status(201).json(savedRide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get pending rides (for drivers)
router.get('/pending', async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get active ride for a user or driver
router.get('/active/:userId', async (req, res) => {
    try {
        const uid = req.params.userId;
        // Find ride where (passengerId OR driverId matches) AND status is pending or accepted
        const ride = await Ride.findOne({
            $or: [{ passengerId: uid }, { driverId: uid }],
            status: { $in: ['pending', 'accepted'] }
        });
        res.json(ride || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update ride status (accept, complete, cancel)
router.patch('/:id', async (req, res) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedRide) {
            res.json(updatedRide);
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
