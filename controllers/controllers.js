// Import the client object from the database configuration file
const { client } = require("../config/database");

// Import the crypto module from Node.js for cryptographic functions
const crypto = require("node:crypto");

// Function to generate a random string of a specified length
const generateRandomString = (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Export an asynchronous function 'createOrder' to handle order creation requests
exports.createOrder = async (req, res) => {
    if (!req.session.cart) {
        res.status(404).json("Cart is empty!");
        return;
    } else {
        try {
            const database = client.db("Airbean");
            const orders = database.collection("Orders");

            const userId = req.session.userID;
            const itemsInCart = req.session.cart;
            let billed = 0;

            // Calculate the total cost of items in the cart
            itemsInCart.forEach((item) => {
                const price = item.price;
                const quantity = item.quantity;
                const cost = price * quantity;
                billed += cost;
            });

            // Generate a unique order ID
            const randomString = generateRandomString(8);
            const orderID = `${userId}${randomString}`;

            // Insert the order into the database
            await orders.insertOne({
                ordernumber: orderID,
                placed_at: new Date().toDateString(),
                coffeeOrdered: itemsInCart,
                billed: `${billed} SEK`,
            });

            // Prepare a confirmation message
            let confirmMessage;
            if (req.session.userID !== "guest") {
                confirmMessage = `Tack för din beställning! Ditt orderId = ${orderID}`;
                req.session.cart = [];
            } else {
                confirmMessage = "Tack för din beställning. Lyfter snart!";
                req.session.cart = [];
            }

            res.status(200).json({ message: confirmMessage });
        } catch (error) {
            res.status(500).json({ message: "Error order failed: " + error.message });
        }
    }
};

// Export an asynchronous function 'addToCart' to handle adding items to the cart
exports.addToCart = async (req, res) => {
    const addItem = req.body.add;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const cart = req.session.cart;

    const database = client.db("Airbean");
    const menu = database.collection("Menu");

    let itemfound = false;

    // Check if the item is already in the cart
    cart.forEach((item) => {
        if (item.id === addItem.id) {
            itemfound = true;
            item.quantity += addItem.quantity;

            res.status(200).json({
                message: `${addItem.quantity} ${item.title} added to cart`,
                cart: req.session.cart,
            });
        }
    });

    // If the item is not found in the cart, add it
    if (!itemfound) {
        const product = await menu.findOne({ id: addItem.id });

        if (product && !itemfound) {
            product.quantity = addItem.quantity;

            cart.push(product);

            res.status(200).json({
                message: `${product.quantity} ${product.title} added to cart`,
                cart: req.session.cart,
            });
        }
    }
};

// Export an asynchronous function 'removeFromCart' to handle removing items from the cart
exports.removeFromCart = async (req, res) => {
    if (req.session.cart && req.session.cart.length > 0) {
        const removeItem = req.body.remove;
        const filterCart = req.session.cart.filter(
            (item) => item.id !== removeItem.id
        );

        req.session.cart = filterCart;
        res.status(200).json({
            message: "Item deleted",
            cart: req.session.cart,
        });
    } else {
        res.status(400).json("Cart empty!");
    }
};

// Export an asynchronous function 'viewCart' to handle viewing the cart
exports.viewCart = async (req, res) => {
    if (req.session.cart) {
        res.status(200).json(req.session.cart);
    } else {
        res.status(400).json("Cart empty!");
    }
};

// Export an asynchronous function 'getPreviousOrders' to handle retrieving previous orders
exports.getPreviousOrders = async (req, res) => {
    try {
        const database = client.db("Airbean");
        const orders = database.collection("Orders");
        const userId = req.session.userID;
        const userOrder = await orders
            .find({
                ordernumber: { $regex: `^${userId}` },
            })
            .toArray();
        if (userOrder && userOrder.length > 0) {
            res.status(200).json(userOrder);
        } else {
            res.status(404).json({ message: "No orders found for this user" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error order failed: " + error.message });
    }
};

// Export an asynchronous function 'continueAsGuest' to handle guest user sessions
exports.continueAsGuest = async (req, res) => {
    req.session.userID = "guest";

    res
        .status(200)
        .json(
            "Please note that you will not be able to review order history or change orders whilst you are logged in as guest"
        );
};

// Export an asynchronous function 'getMenu' to handle retrieving the menu
exports.getMenu = async (req, res) => {
    try {
        const database = client.db("Airbean");
        const menuCollection = database.collection("Menu");

        const fullMenu = await menuCollection.find({}).toArray();

        res.status(200).json({ menuItems: fullMenu });
    } catch (err) {
        console.log("Error fetching menu:", err);
        res.status(500).json({ message: "Error fetching menu: " + err });
    }
};

// Export an asynchronous function 'logIn' to handle user login
exports.logIn = async (req, res) => {
    const details = req.body;

    try {
        const user = crypto
            .createHash("sha256")
            .update(details.username)
            .digest("hex");

        const pass = crypto
            .createHash("sha256")
            .update(details.password)
            .digest("hex");

        const shiftedUser = user.slice(5) + user.slice(0, 5);
        const shiftedPass = pass.slice(5) + pass.slice(0, 5);

        const database = client.db("Airbean");
        const userbase = database.collection("Users");

        const findUser = await userbase.findOne({ username: shiftedUser });

        if (findUser) {
            if (shiftedPass === findUser.password) {
                req.session.userID = findUser.username;

                res.status(200).json("Logged in!");
            } else {
                res.status(200).json("Wrong password");
            }
        } else {
            res.status(404).json("No user found, please create an account!");
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Export an asynchronous function 'signUp' to handle user registration
exports.signUp = async (req, res) => {
    const details = req.body;

    try {
        const user = crypto
            .createHash("sha256")
            .update(details.username)
            .digest("hex");

        const pass = crypto
            .createHash("sha256")
            .update(details.password)
            .digest("hex");

        const email = details.email;

        const shiftedUser = user.slice(5) + user.slice(0, 5);
        const shiftedPass = pass.slice(5) + pass.slice(0, 5);

        const database = client.db("Airbean");
        const userbase = database.collection("Users");
        const emailFormat = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}/;
        const findUser = await userbase.findOne({ username: shiftedUser });

        if (!shiftedUser || !shiftedPass || !email) {
            res.status(401).json("Please enter a username, password & email");
        } else {
            if (findUser) {
                res.status(200).json("User already exists. Please log in!");
            } else {
                if (emailFormat.test(email) == true) {
                    const createUser = await userbase.insertOne({
                        username: shiftedUser,
                        password: shiftedPass,
                        email: email,
                    });
                    req.session.userID = shiftedUser;
                    res.status(200).json(`Welcome to Airbean ${details.username}!`);
                } else {
                    res.status(401).json("Please register with a valid mailadress");
                }
            }
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Export an asynchronous function 'about' to handle requests for the about page
exports.about = async (req, res) => {
    res
        .status(200)
        .json(
            "Welcome to Airbean! We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum!  We are lorem ipsum! Här fortsätter lorem * 20"
        );
};

exports.logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = crypto
      .createHash("sha256")
      .update(username)
      .digest("hex");

    const pass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const shiftedUser = user.slice(5) + user.slice(0, 5);
    const shiftedPass = pass.slice(5) + pass.slice(0, 5);

    const database = client.db("AirbeanSolo");
    const userbase = database.collection("Users");

    const findUser = await userbase.findOne({ username: shiftedUser });

    if (findUser) {
      if (shiftedPass === findUser.password) {
        req.session.userID = findUser.username;
        req.session.userRole = findUser.role; // Assuming role is stored in the user document

        res.status(200).json("Logged in!");
      } else {
        res.status(200).json("Wrong password");
      }
    } else {
      res.status(404).json("No user found, please create an account!");
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};