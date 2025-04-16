const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stayhealthy';

// Suppress the strictQuery warning
mongoose.set('strictQuery', false);

const connectToMongo = async () => {
    console.log('Attempting to connect to MongoDB...');
    let retries = 0;
    const MAX_RETRIES = 2;
    
    while (retries < MAX_RETRIES) {
        try {
            await mongoose.connect(DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 4000, // Reduce timeout to 4 seconds
                connectTimeoutMS: 4000,
                socketTimeoutMS: 45000,
                family: 4 // Force IPv4
            });
            console.log('Connected to MongoDB successfully!');
            return true;
        } catch (error) {
            console.log(`MongoDB connection error: ${error.message}`);
            retries++;
            
            if (retries < MAX_RETRIES) {
                console.log(`Retrying connection, attempt ${retries} of ${MAX_RETRIES}`);
                // Wait 1 second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.log('Unable to connect to MongoDB. Running in offline mode.');
                return false;
            }
        }
    }
    return false;
};

module.exports = connectToMongo;