import express from 'express';
const router = express.Router();
import { db } from '../localDb.js';

// Create a ride request
router.post('/', async (req, res) => {
    try {
        const rideData = {
            ...req.body,
            id: Date.now().toString(),
            _id: Date.now().toString(), // API expects this
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const savedRide = db.addRide(rideData);
        res.status(201).json(savedRide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get pending rides (for drivers)
router.get('/pending', async (req, res) => {
    try {
        const rides = db.findRides(r => r.status === 'pending')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(rides);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get active ride for a user or driver
router.get('/active/:userId', async (req, res) => {
    try {
        const uid = req.params.userId;
        const ride = db.findRide(r =>
            (r.passengerId === uid || r.driverId === uid) &&
            ['pending', 'accepted'].includes(r.status)
        );
        res.json(ride || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update ride status (accept, complete, cancel)
router.patch('/:id', async (req, res) => {
    try {
        const updatedRide = db.updateRide(req.params.id, req.body);
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
