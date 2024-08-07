const app = require("express"); // Import the Express module
const router = app.Router(); // Create a new router object
const authenticateUser = require("../middleware/auth"); // Import the authentication middleware
const handleOrder = require("../middleware/orderHandler"); // Import the order handling middleware
const guestmw = require("../middleware/guestmiddleware"); // Import the guest middleware
const controllers = require("../controllers/controllers"); // Import the controllers
const blockGuest = require("../middleware/guestmiddleware"); // Import the guest blocking middleware

// Define a route for the "about" page
router.get("/about", controllers.about);

// Define a route for user login
router.post("/login", controllers.logIn);

// Define a route for user signup
router.post("/signup", controllers.signUp);

// Define a route for continuing as a guest
router.get("/guest", controllers.continueAsGuest);

// Define a route for viewing the cart, requires user authentication
router.get("/viewcart", authenticateUser, controllers.viewCart);

// Define a route for adding items to the cart, requires user authentication and order handling
router.post("/addtocart", authenticateUser, handleOrder, controllers.addToCart);

// Define a route for removing items from the cart, requires user authentication
router.post("/removefromcart", authenticateUser, controllers.removeFromCart);

// Define a route for viewing the menu, requires user authentication
router.get("/menu", authenticateUser, controllers.getMenu);

// Define a route for creating an order, requires user authentication
router.get("/create", authenticateUser, controllers.createOrder);

// Define a route for viewing order history, requires user authentication and blocks guests
router.get(
  "/orderhistory",
  authenticateUser,
  blockGuest,
  controllers.getPreviousOrders
);

module.exports = router; // Export the router object