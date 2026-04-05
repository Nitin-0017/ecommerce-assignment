import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (request, response) => {
    try {
        let cart = await Cart.findOne({ user: request.user._id }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: request.user._id, items: [] });
        }

        response.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
});

router.post('/add', protect, async (request, response) => {
    try {
        const { productId, quantity = 1 } = request.body;

        const product = await Product.findById(productId);
        if (!product) {
            return response.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let cart = await Cart.findOne({ user: request.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: request.user._id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        await cart.populate('items.product');

        response.json({
            success: true,
            message: 'Product added to cart',
            cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        response.status(500).json({
            success: false,
            message: 'Error adding to cart'
        });
    }
});

router.put('/update/:productId', protect, async (request, response) => {
    try {
        const { quantity } = request.body;
        const { productId } = request.params;

        const cart = await Cart.findOne({ user: request.user._id });

        if (!cart) {
            return response.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(item => item.product.toString() === productId);

        if (!item) {
            return response.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        response.json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        response.status(500).json({
            success: false,
            message: 'Error updating cart'
        });
    }
});

router.delete('/remove/:productId', protect, async (request, response) => {
    try {
        const { productId } = request.params;

        const cart = await Cart.findOne({ user: request.user._id });

        if (!cart) {
            return response.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('items.product');

        response.json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        response.status(500).json({
            success: false,
            message: 'Error removing from cart'
        });
    }
});

router.delete('/clear', protect, async (request, response) => {
    try {
        const cart = await Cart.findOne({ user: request.user._id });

        if (!cart) {
            return response.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        response.json({
            success: true,
            message: 'Cart cleared',
            cart
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        response.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
});

export default router;
