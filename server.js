const cors = require("cors"); // Import the CORS middleware
const app = require("./app"); // Import the Express application

const port = process.env.PORT || 8000; // Define the port, defaulting to 8000 if not set in environment variables

app.use(cors()); // Enable CORS for all routes

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); // Log a message when the server starts
});