const authenticateUser = (req, res, next) => {
  if (!req.session.userID) {
    return res
      .status(401)
      .json({
        message: "Log in if you want to see orderhistory, or continue as guest",
      });
  }
  next();
};

module.exports = authenticateUser;
