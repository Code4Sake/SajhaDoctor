import dotenv from 'dotenv';
// Ensure environment variables are loaded
dotenv.config();

import mongoose from "mongoose";



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas Connected!`);
    console.log(`📍 Database: ${conn.connection.db.databaseName}`);
    console.log(`🏠 Host: ${conn.connection.host}`);

    // List all collections to see what's actually there
    setTimeout(async () => {
      try {
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));
      } catch (err) {
        console.log('Could not list collections:', err.message);
      }
    }, 1000);

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB
