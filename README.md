# Airbean (Node.js school project)

This repository contains the backend part of a Node.js project for the course examination. The project was initially developed as a group effort, and this individual part builds upon that foundation.

## API Documentation

### 1. Auth Operations

| **Operation (Description)** | **Method** | **Endpoint** | **Request Format** | **Response** | **Requirements** |
|-----------------------------|------------|--------------|--------------------|--------------|------------------|
| **Sign Up (Create a new account)** | POST | `/signup` | ```json { "username": "Simon", "password": "kakor", "email": "simon@gmail.com" } ``` | - **200 OK:** Welcome message - **401 Unauthorized:** Missing fields or invalid email - **500 Internal Server Error:** Server-side error | All fields are required |
| **Log In (Log in to an existing account)** | POST | `/login` | ```json { "username": "Simon", "password": "kakor" } ``` | - **200 OK:** Logged in message - **401 Unauthorized:** Wrong password - **404 Not Found:** User not found - **500 Internal Server Error:** Server-side error | All fields are required |
| **Continue as Guest (Proceed without an account)** | GET | `/guest` | None | - **200 OK:** Guest mode activated | None |



### 2. Cart and Order Operations

| **Operation (Description)** | **Method** | **Endpoint** | **Request Format** | **Response** | **Requirements** |
|-----------------------------|------------|--------------|--------------------|--------------|------------------|
| **View Cart (View the current user's cart)** | GET | `/viewcart` | None | - **200 OK:** Cart contents - **400 Bad Request:** Cart is empty - **500 Internal Server Error:** Server-side error | User must be authenticated |
| **Add to Cart (Add an item to the user's cart)** | POST | `/addtocart` | ```json { "id": "12345", "quantity": 2 } ``` | - **200 OK:** Item added - **401 Unauthorized:** Item not found - **500 Internal Server Error:** Server-side error | User must be authenticated |
| **Remove from Cart (Remove an item from the user's cart)** | POST | `/removefromcart` | ```json { "id": "12345" } ``` | - **200 OK:** Item removed - **400 Bad Request:** Cart is empty - **500 Internal Server Error:** Server-side error | User must be authenticated |
| **Get Menu (Retrieve the list of available products)** | GET | `/menu` | None | - **200 OK:** List of products - **500 Internal Server Error:** Server-side error | User must be authenticated |
| **Create Order (Place an order based on the cart contents)** | GET | `/create` | None | - **200 OK:** Order placed - **404 Not Found:** Cart is empty - **500 Internal Server Error:** Server-side error | User must be authenticated |
| **View Order History (Retrieve the user's previous orders)** | GET | `/orderhistory` | None | - **200 OK:** Order history - **401 Unauthorized:** Access denied for guests - **500 Internal Server Error:** Server-side error | User must be authenticated, not a guest |



### 3. Product Operations

| **Operation (Description)** | **Method** | **Endpoint** | **Request Format** | **Response** | **Requirements** |
|-----------------------------|------------|--------------|--------------------|--------------|------------------|
| **Add Product (Add a new product to the menu)** | POST | `/products/add-product` | ```json { "id": "12345", "title": "Latte", "desc": "A smooth coffee with milk", "price": 40 } ``` | - **201 Created:** Product added successfully - **400 Bad Request:** Missing fields - **500 Internal Server Error:** Server-side error | User must be an authenticated admin |
| **Modify Product (Modify an existing product's details)** | PUT | `/products/modify-product/:id` | ```json { "title": "Cappuccino", "desc": "A rich coffee with frothed milk", "price": 45 } ``` | - **200 OK:** Product modified successfully - **400 Bad Request:** No fields provided for update - **404 Not Found:** Product not found - **500 Internal Server Error:** Server-side error | User must be an authenticated admin, `id` in the URL can be either a MongoDB ObjectId or custom ID |
| **Delete Product (Remove a product from the menu)** | DELETE | `/products/delete-product/:id` | None | - **200 OK:** Product deleted successfully - **404 Not Found:** Product not found - **500 Internal Server Error:** Server-side error | User must be an authenticated admin, `id` in the URL can be either a MongoDB ObjectId or custom ID |
| **Add Campaign (Create a campaign offer with multiple products)** | POST | `/products/add-campaign` | ```json { "products": ["12345", "67890"], "campaignPrice": 75 } ``` | - **201 Created:** Campaign added successfully - **400 Bad Request:** Invalid request body - **404 Not Found:** One or more products not found - **500 Internal Server Error:** Server-side error | User must be an authenticated admin |

### Credentials for Admin Access
- **Username:** `MrBarista`
- **Password:** `Kaffemoster`

These operations allow for the management of products and campaigns, which is generally restricted to users with admin privileges.

---
