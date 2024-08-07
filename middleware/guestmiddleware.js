const blockGuest = (req, res, next) => {
  if (req.session.userID === "guest") {
    res
      .status(401)
      .json("Please create an account in order to view order history");
  } else {
    next();
  }
};

module.exports = blockGuest;
