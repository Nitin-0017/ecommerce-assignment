import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, async (request, response) => {
    try {
        response.json({
            success: true,
            user: {
                id: request.user._id,
                name: request.user.name,
                email: request.user.email,
                phone: request.user.phone,
                addresses: request.user.addresses,
                notifications: request.user.notifications
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

router.put('/profile', protect, async (request, response) => {
    try {
        const { name, phone } = request.body;

        const user = await User.findById(request.user._id);

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        response.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                notifications: user.notifications
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

router.post('/addresses', protect, async (request, response) => {
    try {
        const address = request.body;

        const user = await User.findById(request.user._id);

        if (address.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(address);
        await user.save();

        response.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: user.addresses
        });
    } catch (error) {
        console.error('Add address error:', error);
        response.status(500).json({
            success: false,
            message: 'Error adding address'
        });
    }
});

router.put('/addresses/:id', protect, async (request, response) => {
    try {
        const user = await User.findById(request.user._id);
        const address = user.addresses.id(request.params.id);

        if (!address) {
            return response.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        Object.assign(address, request.body);

        if (address.isDefault) {
            user.addresses.forEach(addr => {
                if (addr._id.toString() !== request.params.id) {
                    addr.isDefault = false;
                }
            });
        }

        await user.save();

        response.json({
            success: true,
            message: 'Address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        console.error('Update address error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating address'
        });
    }
});

router.delete('/addresses/:id', protect, async (request, response) => {
    try {
        const user = await User.findById(request.user._id);
        user.addresses.id(request.params.id).remove();
        await user.save();

        response.json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses
        });
    } catch (error) {
        console.error('Delete address error:', error);
        response.status(500).json({
            success: false,
            message: 'Error deleting address'
        });
    }
});

router.patch('/notifications', protect, async (request, response) => {
    try {
        const { orderUpdates } = request.body;

        const user = await User.findById(request.user._id);

        if (!user.notifications) {
            user.notifications = {};
        }

        if (typeof orderUpdates === 'boolean') {
            user.notifications.orderUpdates = orderUpdates;
        }

        await user.save();

        response.json({
            success: true,
            message: 'Notification preferences updated',
            notifications: user.notifications
        });
    } catch (error) {
        console.error('Update notifications error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating notification preferences'
        });
    }
});

export default router;
