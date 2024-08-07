// Define the authenticateUser middleware function
const authenticateUser = (req, res, next) => {
  // Check if the userID exists in the session
  if (!req.session.userID) {
    // If userID does not exist, send a 401 Unauthorized response with a JSON message
    return res
      .status(401)
      .json({
        message: "Log in if you want to see orderhistory, or continue as guest",
      });
  }
  // If userID exists, proceed to the next middleware
  next();
};

// Export the authenticateUser function
module.exports = authenticateUser;