const express = require("express"); // Import the Express module
const session = require("express-session"); // Import the express-session module for session management
const { connectToMongoDB } = require("./config/database"); // Import the function to connect to MongoDB
const routes = require("./routes/routes"); // Import the routes
const productRoutes = require("./routes/productRoutes");

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON bodies

// Middleware to handle sessions
app.use(
  session({
    secret: "grupp7", // Secret key for signing the session ID cookie
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false }, // Cookie settings (secure should be true in production with HTTPS)
  })
);

app.use("/", routes); // Use the imported routes for the root path
app.use("/products", productRoutes); 

connectToMongoDB(); // Connect to MongoDB

module.exports = app; // Export the Express application