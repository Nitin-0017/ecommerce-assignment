import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const signup = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { name, email, password, phone } = request.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({
                success: false,
                message: 'This email is already registered with us. Try logging in!'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        const token = generateToken(user._id);

        response.status(201).json({
            success: true,
            message: 'Welcome to SwiftKart! Your account has been created.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                notifications: user.notifications
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        response.status(500).json({
            success: false,
            message: 'Oops! Something went wrong while creating your account. Please try again.'
        });
    }
};

export const login = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { email, password } = request.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return response.status(401).json({
                success: false,
                message: 'Invalid email or password. Please check your credentials.'
            });
        }

        const token = generateToken(user._id);

        response.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                notifications: user.notifications
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).json({
            success: false,
            message: 'We encountered an error while signing you in. Please hang tight!'
        });
    }
};

export const getMe = async (request, response) => {
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
            message: 'Could not fetch your profile data. Try refreshing!'
        });
    }
};
