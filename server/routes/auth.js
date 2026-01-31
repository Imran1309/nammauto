import express from 'express';
const router = express.Router();
import { db } from '../localDb.js';

// Login / Register
router.post('/login', async (req, res) => {
    const { name, phone, role, vehicleDetails, email } = req.body;

    try {
        let user = db.findUser(u => u.phone === phone);

        if (!user) {
            // Create new user
            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                _id: Math.random().toString(36).substr(2, 9), // API expects this property
                name,
                phone,
                role,
                vehicleDetails,
                email: email || `${phone}@nammauto.com`,
                status: 'offline',
                location: 'Unknown',
                rating: 5.0,
                createdAt: new Date().toISOString()
            };
            user = db.addUser(newUser);
        } else {
            // Update status if driver logs in
            if (role === 'driver') {
                user = db.updateUser(user.id, { status: 'online' });
            }
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/drivers', async (req, res) => {
    try {
        const drivers = db.findUsers(u => u.role === 'driver' && u.status === 'online');
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update driver status
router.patch('/:id/status', async (req, res) => {
    try {
        const user = db.updateUser(req.params.id, { status: req.body.status });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
