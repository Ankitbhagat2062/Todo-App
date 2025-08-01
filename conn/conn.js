import mongoose from 'mongoose';
import dotenv from 'dotenv'; //If you are cloning then No need of this line

dotenv.config(); //If you are cloning then No need of this line

const conn = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;//If you are cloning my repo then replace process.env.Mongo_URI with you url MongoDb cluster url.
        if (!mongoUri) {// sample url mongodb+srv://<username>:<password><Clustername>.ks8o7ls.mongodb.net/
            throw new Error('MONGO_URI environment variable is not set');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

export default conn;
