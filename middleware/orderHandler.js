const { client } = require("../config/database");

// Define the handleOrder middleware function
const handleOrder = async (req, res, next) => {
  // Extract order details from the request body
  const details = req.body;
  const order = details.add;

  // Connect to the Airbean database and the Menu collection
  const database = client.db("Airbean");
  const menu = database.collection("Menu");

  // Initialize validOrder flag
  let validOrder = true;

  // Find the item in the Menu collection
  const item = await menu.findOne({ id: order.id });

  // Handle invalid item
  if (!item) {
    validOrder = false;
    res
      .status(401)
      .json("The item you are trying to add can't be found. Try again!");
    return;
  }

  // Proceed to the next middleware if the order is valid
  if (validOrder) {
    next();
  }
};

// Export the handleOrder function
module.exports = handleOrder;