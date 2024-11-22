const { MongoClient, ServerApiVersion } = require('mongodb');

async function connectDB() {
    const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@aipeoplecount.rdtpe.mongodb.net/?retryWrites=true&w=majority&appName=AIPeopleCount`;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
module.exports = { connectDB };
