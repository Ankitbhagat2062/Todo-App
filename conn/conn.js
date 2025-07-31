
import mongoose from  'mongoose';

const conn = async () => {
  try {
    await mongoose.connect('mongodb+srv://ankitbhagat2062:Ankit%230987@todoapp.1by1np7.mongodb.net/');
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

export default conn;
