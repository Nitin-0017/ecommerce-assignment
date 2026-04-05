import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch((error) => {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (request, response) => {
  response.json({ status: 'OK', message: 'SwiftKart API is running' });
});

app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

import cron from 'node-cron';
import {
  transitionToProcessing,
  transitionToShipped,
  transitionToDelivered,
  transitionToReturned
} from './utils/orderAutomation.js';

cron.schedule('0 * * * *', async () => {
  try {
    const processing = await transitionToProcessing();
    const shipped = await transitionToShipped();
    const delivered = await transitionToDelivered();
    const returned = await transitionToReturned();

    const total = processing + shipped + delivered + returned;
    if (total > 0) {
      console.log(`📦 Order automation: ${processing} → processing, ${shipped} → shipped, ${delivered} → delivered, ${returned} → returned`);
    }
  } catch (error) {
    console.error('❌ Order automation error:', error);
  }
});

console.log('✅ Order automation scheduler initialized (runs every hour)');

app.listen(PORT, () => {
  console.log(`
  -----------------------------------------
     🚀 SWIFTKART API IS LIVE
     📡 Port: ${PORT}
     🌍 Environment: ${process.env.NODE_ENV || 'development'}
  -----------------------------------------
  `);
});
