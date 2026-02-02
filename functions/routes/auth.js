
import express from 'express';
const router = express.Router();
import User from '../models/User.js';

// Login / Register
router.post('/login', async (req, res) => {
    const { name, phone, role, vehicleDetails, email } = req.body;

    try {
        let user = await User.findOne({ phone });

        if (!user) {
            user = new User({
                name,
                phone,
                role,
                vehicleDetails,
                email: email || `${phone}@nammauto.in`,
                status: 'offline', // default
                location: 'Unknown',
                rating: 5.0
            });
            await user.save();
        } else {
            // Update status if driver logs in
            if (role === 'driver') {
                user.status = 'online';
                await user.save();
            }
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/drivers', async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver', status: 'online' });
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update driver status
router.patch('/:id/status', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
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
