import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (request, response) => {
    try {
        const notifications = await Notification.find({ user: request.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        response.json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
});

router.patch('/:id/read', protect, async (request, response) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: request.params.id, user: request.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return response.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        response.json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating notification'
        });
    }
});

router.patch('/read-all', protect, async (request, response) => {
    try {
        await Notification.updateMany(
            { user: request.user._id, isRead: false },
            { isRead: true }
        );

        response.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating notifications'
        });
    }
});

export default router;
