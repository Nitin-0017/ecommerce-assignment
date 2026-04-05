import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Helper function to create a notification for a user
 * @param {string} userId - ID of the user
 * @param {string} orderId - ID of the order
 * @param {string} status - New status of the order
 * @param {string} customMessage - Optional custom message
 */
export const createNotification = async (userId, orderId, status, customMessage = null) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.notifications?.orderUpdates) {
            console.log(`Notifications disabled or user not found for user ${userId}`);
            return null;
        }

        const statusMessages = {
            'confirmed': 'Your order has been confirmed!',
            'processing': 'Your order is being processed.',
            'shipped': 'Your order has been shipped!',
            'delivered': 'Your order has been delivered! Enjoy your purchase.',
            'cancelled': 'Your order has been cancelled.',
            'return_requested': 'Your return request has been received.',
            'returned': 'Your order has been successfully returned.',
            'refunded': 'Your refund has been processed.'
        };

        const message = customMessage || statusMessages[status] || `Order status updated to ${status}`;

        const notification = await Notification.create({
            user: userId,
            order: orderId,
            status,
            message
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};
