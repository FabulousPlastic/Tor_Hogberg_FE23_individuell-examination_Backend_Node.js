// Import the MongoClient and ServerApiVersion from the mongodb package
const { MongoClient, ServerApiVersion } = require("mongodb");

// Define the MongoDB connection URI
const uri =
  "mongodb+srv://torhogberg:<ng16V87NnyM4gnTy>@cluster0.2ms5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient instance with options to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define an asynchronous function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Airbean").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    // Log any errors that occur during the connection process
    console.error("Error connecting to MongoDB", error);
    // Exit the process with a failure code
    process.exit(1);
  }
};

// Export the connectToMongoDB function and the client instance
module.exports = { connectToMongoDB, client };