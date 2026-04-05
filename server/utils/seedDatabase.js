import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
    {
        title: "Classic Men's Cotton T-Shirt",
        price: 19.99,
        description: "Premium quality cotton t-shirt for everyday comfort. Soft fabric with a regular fit perfect for casual wear.",
        category: "men's clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop",
        rating: { rate: 4.5, count: 120 },
        stock: 50
    },
    {
        title: "Men's Slim Fit Denim Jeans",
        price: 45.99,
        description: "Classic blue denim jeans with a modern slim fit. Durable fabric that gets better with every wash.",
        category: "men's clothing",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop",
        rating: { rate: 4.3, count: 200 },
        stock: 75
    },
    {
        title: "Premium Leather Jacket",
        price: 129.99,
        description: "Genuine leather jacket with premium quality stitching. Perfect for style and warmth in cool weather.",
        category: "men's clothing",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop",
        rating: { rate: 4.8, count: 89 },
        stock: 30
    },
    {
        title: "Casual Button-Down Shirt",
        price: 34.99,
        description: "Versatile button-down shirt suitable for both casual and semi-formal occasions.",
        category: "men's clothing",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop",
        rating: { rate: 4.2, count: 150 },
        stock: 60
    },
    {
        title: "Women's Elegant Summer Dress",
        price: 59.99,
        description: "Beautiful floral summer dress with a flattering fit. Perfect for warm weather and special occasions.",
        category: "women's clothing",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop",
        rating: { rate: 4.6, count: 180 },
        stock: 45
    },
    {
        title: "Women's Skinny Fit Jeans",
        price: 42.99,
        description: "Stretchy skinny jeans that provide both comfort and style. Available in classic blue denim.",
        category: "women's clothing",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop",
        rating: { rate: 4.4, count: 220 },
        stock: 80
    },
    {
        title: "Elegant Women's Blazer",
        price: 79.99,
        description: "Professional blazer perfect for office wear. Tailored fit with quality fabric.",
        category: "women's clothing",
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&auto=format&fit=crop",
        rating: { rate: 4.7, count: 95 },
        stock: 40
    },
    {
        title: "Casual Women's Hoodie",
        price: 38.99,
        description: "Cozy hoodie made from soft fabric. Perfect for casual outings and lounging.",
        category: "women's clothing",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop",
        rating: { rate: 4.3, count: 165 },
        stock: 70
    },
    {
        title: "Gold Plated Chain Necklace",
        price: 89.99,
        description: "Elegant gold-plated necklace with intricate chain design. Perfect for special occasions.",
        category: "jewelery",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop",
        rating: { rate: 4.8, count: 75 },
        stock: 25
    },
    {
        title: "Diamond Stud Earrings",
        price: 149.99,
        description: "Classic diamond stud earrings with sterling silver setting. Timeless elegance.",
        category: "jewelery",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop",
        rating: { rate: 4.9, count: 120 },
        stock: 30
    },
    {
        title: "Silver Bracelet Set",
        price: 64.99,
        description: "Set of three silver bracelets with modern design. Can be worn together or separately.",
        category: "jewelery",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop",
        rating: { rate: 4.5, count: 88 },
        stock: 50
    },
    {
        title: "Pearl Drop Earrings",
        price: 54.99,
        description: "Elegant freshwater pearl earrings with gold-plated hooks. Perfect for formal wear.",
        category: "jewelery",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop",
        rating: { rate: 4.6, count: 92 },
        stock: 40
    },
    {
        title: "Wireless Bluetooth Headphones",
        price: 79.99,
        description: "Premium wireless headphones with noise cancellation. 30-hour battery life.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
        rating: { rate: 4.7, count: 340 },
        stock: 100
    },
    {
        title: "Smart Watch Series 5",
        price: 199.99,
        description: "Advanced smartwatch with fitness tracking, heart rate monitor, and notification features.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
        rating: { rate: 4.6, count: 280 },
        stock: 85
    },
    {
        title: "Professional DSLR Camera",
        price: 899.99,
        description: "High-quality DSLR camera with 24MP sensor. Perfect for photography enthusiasts.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop",
        rating: { rate: 4.9, count: 150 },
        stock: 45
    },
    {
        title: "Portable Bluetooth Speaker",
        price: 49.99,
        description: "Waterproof portable speaker with amazing sound quality. 12-hour battery life.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop",
        rating: { rate: 4.5, count: 420 },
        stock: 120
    },
    {
        title: "Gaming Mechanical Keyboard",
        price: 89.99,
        description: "RGB backlit mechanical keyboard with customizable keys. Perfect for gamers.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop",
        rating: { rate: 4.6, count: 189 },
        stock: 75
    },
    {
        title: "Wireless Gaming Mouse",
        price: 59.99,
        description: "Ergonomic wireless gaming mouse with adjustable DPI. Precision tracking.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop",
        rating: { rate: 4.4, count: 205 },
        stock: 90
    },
    {
        title: "USB-C Hub Multi-Port Adapter",
        price: 39.99,
        description: "7-in-1 USB-C hub with HDMI, USB 3.0 ports, and SD card reader.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&auto=format&fit=crop",
        rating: { rate: 4.3, count: 167 },
        stock: 110
    },
    {
        title: "Laptop Stand Adjustable",
        price: 34.99,
        description: "Ergonomic laptop stand with adjustable height. Improves posture and airflow.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop",
        rating: { rate: 4.5, count: 198 },
        stock: 95
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(' Connected to MongoDB');

        await Product.deleteMany({});
        console.log('  Cleared existing products');

        await Product.insertMany(products);
        console.log(` Seeded ${products.length} products with Unsplash images`);

        console.log(' Database seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error(' Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
