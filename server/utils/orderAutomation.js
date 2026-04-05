import Order from '../models/Order.js';
import { createNotification } from './notificationHelper.js';

export const transitionToProcessing = async () => {
    try {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        const orders = await Order.find({
            confirmedAt: { $lt: twelveHoursAgo },
            orderStatus: 'confirmed'
        });

        for (const order of orders) {
            order.orderStatus = 'processing';
            order.processingAt = new Date();
            order.statusHistory.push({
                status: 'processing',
                note: 'Auto-transitioned by system'
            });
            await order.save();
            await createNotification(order.user, order._id, 'processing');
        }

        return orders.length;
    } catch (error) {
        console.error('Error in transitionToProcessing:', error);
        return 0;
    }
};

export const transitionToShipped = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            confirmedAt: { $lt: twentyFourHoursAgo },
            orderStatus: { $nin: ['cancelled', 'return_requested', 'returned', 'refunded', 'shipped', 'delivered'] },
            $or: [
                { orderStatus: 'confirmed' },
                { orderStatus: 'processing' }
            ]
        });

        for (const order of orders) {
            order.orderStatus = 'shipped';
            order.shippedAt = new Date();
            order.statusHistory.push({
                status: 'shipped',
                note: 'Auto-transitioned by system'
            });
            await order.save();
            await createNotification(order.user, order._id, 'shipped');
        }

        return orders.length;
    } catch (error) {
        console.error('Error in transitionToShipped:', error);
        return 0;
    }
};

export const transitionToDelivered = async () => {
    try {
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        const orders = await Order.find({
            confirmedAt: { $lt: fortyEightHoursAgo },
            orderStatus: { $nin: ['delivered', 'cancelled', 'return_requested', 'returned', 'refunded'] }
        });

        for (const order of orders) {
            order.orderStatus = 'delivered';
            order.deliveredAt = new Date();
            order.statusHistory.push({
                status: 'delivered',
                note: 'Auto-transitioned by system'
            });
            await order.save();
            await createNotification(order.user, order._id, 'delivered');
        }

        return orders.length;
    } catch (error) {
        console.error('Error in transitionToDelivered:', error);
        return 0;
    }
};

export const transitionToReturned = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            returnRequestedAt: { $lt: twentyFourHoursAgo },
            orderStatus: 'return_requested'
        });

        for (const order of orders) {
            order.orderStatus = 'returned';
            order.returnedAt = new Date();
            order.statusHistory.push({
                status: 'returned',
                note: 'Auto-transitioned after 24 hours'
            });
            await order.save();
            await createNotification(order.user, order._id, 'returned');
        }

        return orders.length;
    } catch (error) {
        console.error('Error in transitionToReturned:', error);
        return 0;
    }
};
