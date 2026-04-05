import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { signup, login, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup',
    [
        body('name').trim().notEmpty().withMessage('Tell us your name!'),
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
    ],
    signup
);

router.post('/login',
    [
        body('email').isEmail().withMessage('A valid email is required to login'),
        body('password').notEmpty().withMessage('Please enter your password')
    ],
    login
);

router.get('/me', protect, getMe);

export default router;
