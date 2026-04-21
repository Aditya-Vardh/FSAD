import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/test_verification';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected to MongoDB!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

testConnection();
