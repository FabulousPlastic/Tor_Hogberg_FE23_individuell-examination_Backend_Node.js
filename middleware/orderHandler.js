const { client } = require("../config/database");

const handleOrder = async (req, res, next) => {
  const details = req.body;
  const order = details.add;

  const database = client.db("Airbean");
  const menu = database.collection("Menu");

  let validOrder = true;

  const item = await menu.findOne({ id: order.id });

  if (!item) {
    validOrder = false;
    res
      .status(401)
      .json("The item you are trying to add cant be found. Try again!");
    return;
  }

  if (validOrder) {
    next();
  }
};

module.exports = handleOrder;
