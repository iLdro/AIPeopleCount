const mongoose = require('mongoose');

async function connectDB() {
    const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@aipeoplecount.rdtpe.mongodb.net/AIPeopleCount?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri); // No additional options needed
        console.log("Connected to MongoAtlas");
    } catch (error) {
        console.error("Error connecting to MongoAtlas:", error.message);
    }
}

module.exports = { connectDB };
