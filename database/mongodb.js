import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from '../config/env.js';

if (!DB_URI) {
    throw new Error('DB_URI is not defined in environment variables inside .env.development.local file');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectToDatabase;