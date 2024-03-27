const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const path = process.env.MONGO_URI;
        const conn = await mongoose.connect(path, {}, { useCreateIndex: true });
        console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// const db = connectDB;

module.exports = connectDB;