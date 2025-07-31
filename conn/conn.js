import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conn = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

export default conn;
