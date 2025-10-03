
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    let session;
    
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { name, email, password } = req.body;

        console.log('Received data:', { name, email, password: password ? '***' : undefined });

        if (!name || !email || !password) {
            const error = new Error('Please provide name, email, and password');
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Password hashed successfully');

        const newUser = new User({
            name,
            email,
            password
        });

        const savedUser = await newUser.save({ session });
        
        console.log('User saved:', savedUser._id);

        if (!savedUser || !savedUser._id) {
            throw new Error('Failed to create user');
        }

        const token = jwt.sign(
            { userId: savedUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        await session.commitTransaction();

        console.log('Transaction committed successfully');

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        
        console.error('Sign Up Error:', error.message);
        console.error('Stack:', error.stack);
        
        next(error);
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

export const signIn = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        const ispasswordvalid = await bcrypt.compare(password, user.password);
        if (!ispasswordvalid) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            data: {
                user,
                token
            }
        });
        res.status(200).json({ message: 'Sign-in successful',
            data: { user, token } });
    } catch (error) {
        next(error);
    }   
};

export const signOut = async (req, res, next) => {};