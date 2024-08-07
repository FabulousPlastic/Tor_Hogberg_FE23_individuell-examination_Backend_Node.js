// Define the blockGuest middleware function
const blockGuest = (req, res, next) => {
  // Check if the userID is "guest"
  if (req.session.userID === "guest") {
    // If userID is "guest", send a 401 Unauthorized response with a JSON message
    res
      .status(401)
      .json("Please create an account in order to view order history");
  } else {
    // If userID is not "guest", proceed to the next middleware
    next();
  }
};

// Export the blockGuest function
module.exports = blockGuest;