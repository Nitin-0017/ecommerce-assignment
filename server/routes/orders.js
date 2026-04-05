import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/auth.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createNotification } from '../utils/notificationHelper.js';

let razorpayInstance = null;

const getRazorpay = () => {
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpayInstance;
};

const router = express.Router();

router.post('/', protect, async (request, response) => {
    try {
        const { shippingAddress, paymentMethod, selectedItemIds, items, subtotal, tax, shipping, total } = request.body;

        console.log('📦 Order creation request received');
        console.log('User:', request.user._id);
        console.log('Payment method:', paymentMethod);
        console.log('Items in request:', items ? items.length : 'none');
        console.log('Selected items:', selectedItemIds);

        let orderItems, orderSubtotal, orderTax, orderShipping, orderTotal;

        // Buy Now flow - items come from request body
        if (items && items.length > 0) {
            console.log('✅ Using Buy Now flow (items from request body)');
            orderItems = items;
            orderSubtotal = subtotal;
            orderTax = tax;
            orderShipping = shipping;
            orderTotal = total;
        } else {
            // Cart checkout flow - items come from cart
            console.log('📦 Using Cart checkout flow');
            const cart = await Cart.findOne({ user: request.user._id }).populate('items.product');

            if (!cart || cart.items.length === 0) {
                console.log('❌ Cart is empty');
                return response.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                });
            }

            let checkoutItems = cart.items;
            if (selectedItemIds && Array.isArray(selectedItemIds) && selectedItemIds.length > 0) {
                checkoutItems = cart.items.filter(item => selectedItemIds.includes(item.product._id.toString()));
            }

            if (checkoutItems.length === 0) {
                return response.status(400).json({
                    success: false,
                    message: 'No items selected for checkout'
                });
            }

            orderItems = checkoutItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            orderSubtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            orderTax = orderSubtotal * 0.18;
            orderShipping = orderSubtotal > 500 ? 0 : 40;
            orderTotal = orderSubtotal + orderTax + orderShipping;

            // Clear cart items after order
            if (selectedItemIds && Array.isArray(selectedItemIds)) {
                cart.items = cart.items.filter(item => !selectedItemIds.includes(item.product._id.toString()));
            } else {
                cart.items = [];
            }
            await cart.save();
        }

        const order = await Order.create({
            user: request.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            subtotal: orderSubtotal,
            tax: orderTax,
            shipping: orderShipping,
            total: orderTotal,
            orderStatus: 'confirmed',
            confirmedAt: new Date(),
            statusHistory: [{
                status: 'confirmed',
                note: 'Order placed'
            }]
        });

        await order.populate('items.product');

        // Trigger notification
        await createNotification(request.user._id, order._id, 'confirmed');

        response.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        console.error('Error details:', error.message);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
        response.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

router.get('/', protect, async (request, response) => {
    try {
        const orders = await Order.find({ user: request.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        response.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

router.get('/:id', protect, async (request, response) => {
    try {
        const order = await Order.findById(request.params.id).populate('items.product');

        if (!order) {
            return response.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== request.user._id.toString()) {
            return response.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        response.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
});

router.post('/razorpay', protect, async (request, response) => {
    try {
        const { amount } = request.body;

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpay = getRazorpay();
        const order = await razorpay.orders.create(options);

        response.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(' Razorpay order creation error:');
        console.error('Error object:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error description:', error.error?.description);

        response.status(500).json({
            success: false,
            message: 'Error creating Razorpay order',
            error: error.error?.description || error.message
        });
    }
});

router.post('/verify', protect, async (request, response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
            selectedItemIds
        } = request.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const order = await Order.create({
                ...orderData,
                user: request.user._id,
                paymentStatus: 'completed',
                orderStatus: 'confirmed',
                confirmedAt: new Date(),
                statusHistory: [{
                    status: 'confirmed',
                    note: 'Order placed with online payment'
                }],
                paymentDetails: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature
                }
            });

            // Trigger notification
            await createNotification(request.user._id, order._id, 'confirmed');

            if (selectedItemIds && Array.isArray(selectedItemIds)) {
                const cart = await Cart.findOne({ user: request.user._id });
                if (cart) {
                    cart.items = cart.items.filter(item => !selectedItemIds.includes(item.product.toString()));
                    await cart.save();
                }
            } else {
                await Cart.findOneAndUpdate({ user: request.user._id }, { items: [] });
            }

            response.json({
                success: true,
                message: "Payment verified successfully",
                order
            });
        } else {
            response.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }
    } catch (error) {
        console.error('Razorpay verification error:', error);
        response.status(500).json({
            success: false,
            message: 'Error verifying payment'
        });
    }
});

router.patch('/:id/cancel', protect, async (request, response) => {
    try {
        const order = await Order.findById(request.params.id);

        if (!order) {
            return response.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== request.user._id.toString()) {
            return response.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        if (['shipped', 'delivered', 'return_requested', 'returned', 'refunded'].includes(order.orderStatus)) {
            return response.status(400).json({
                success: false,
                message: 'Order cannot be cancelled after shipping'
            });
        }

        order.orderStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.statusHistory.push({
            status: 'cancelled',
            note: 'Cancelled by user'
        });
        await order.save();

        // Trigger notification
        await createNotification(request.user._id, order._id, 'cancelled');

        response.json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        response.status(500).json({
            success: false,
            message: 'Error cancelling order'
        });
    }
});

router.patch('/:id/return', protect, async (request, response) => {
    try {
        const { reason } = request.body;
        const order = await Order.findById(request.params.id);

        if (!order) {
            return response.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== request.user._id.toString()) {
            return response.status(403).json({
                success: false,
                message: 'Not authorized to return this order'
            });
        }

        if (order.orderStatus !== 'delivered') {
            return response.status(400).json({
                success: false,
                message: 'Only delivered orders can be returned'
            });
        }

        const deliveryDate = order.updatedAt || order.createdAt;
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(deliveryDate).getTime() > sevenDaysInMs) {

        }

        order.orderStatus = 'return_requested';
        order.returnRequestedAt = new Date();
        order.returnReason = reason;
        order.statusHistory.push({
            status: 'return_requested',
            note: `Return requested: ${reason}`
        });
        await order.save();

        // Trigger notification
        await createNotification(request.user._id, order._id, 'return_requested');

        response.json({
            success: true,
            message: 'Return request submitted successfully',
            order
        });
    } catch (error) {
        console.error('Return order error:', error);
        response.status(500).json({
            success: false,
            message: 'Error processing return request'
        });
    }
});

router.patch('/:id/refund', protect, async (request, response) => {
    try {
        const order = await Order.findById(request.params.id);

        if (!order) {
            return response.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== request.user._id.toString()) {
            return response.status(403).json({
                success: false,
                message: 'Not authorized to process refund for this order'
            });
        }

        if (order.orderStatus !== 'returned') {
            return response.status(400).json({
                success: false,
                message: 'Only returned orders can be refunded'
            });
        }

        order.orderStatus = 'refunded';
        order.refundedAt = new Date();
        order.statusHistory.push({
            status: 'refunded',
            note: 'Refund processed'
        });
        await order.save();

        // Trigger notification
        await createNotification(request.user._id, order._id, 'refunded');

        response.json({
            success: true,
            message: 'Refund processed successfully',
            order
        });
    } catch (error) {
        console.error('Refund order error:', error);
        response.status(500).json({
            success: false,
            message: 'Error processing refund'
        });
    }
});

export default router;
