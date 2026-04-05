import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const { category, minPrice, maxPrice, minRating, search, sort, limit = 50 } = request.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (minRating) {
            query['rating.rate'] = { $gte: parseFloat(minRating) };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = {};
        if (sort === 'price-asc') sortOption.price = 1;
        else if (sort === 'price-desc') sortOption.price = -1;
        else if (sort === 'rating-desc') sortOption['rating.rate'] = -1;
        else sortOption.createdAt = -1;

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(parseInt(limit));

        response.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
});

router.get('/:id', async (request, response) => {
    try {
        const product = await Product.findById(request.params.id);

        if (!product) {
            return response.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        response.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        response.status(500).json({
            success: false,
            message: 'Error fetching product'
        });
    }
});

router.get('/:id/related', async (request, response) => {
    try {
        const product = await Product.findById(request.params.id);
        if (!product) {
            return response.status(404).json({ success: false, message: 'Product not found' });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(6);

        response.json({
            success: true,
            products: relatedProducts
        });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching related products' });
    }
});

router.get('/:id/reviews', async (request, response) => {
    try {
        const reviews = await Review.find({ product: request.params.id })
            .sort({ createdAt: -1 });

        response.json({
            success: true,
            reviews
        });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
});

router.post('/:id/reviews', protect, async (request, response) => {
    try {
        const { rating, comment } = request.body;
        const productId = request.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return response.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = new Review({
            product: productId,
            user: request.user._id,
            username: request.user.name,
            rating: Number(rating),
            comment
        });

        await review.save();

        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        product.rating.rate = avgRating;
        product.rating.count = reviews.length;
        await product.save();

        response.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        console.error('Add review error:', error);
        response.status(500).json({ success: false, message: 'Error adding review' });
    }
});

export default router;
