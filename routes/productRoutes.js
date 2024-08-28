const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Endpoint to add a new product
router.post('/add-product', authenticateAdmin, async (req, res) => {
  const { id, title, desc, price } = req.body;

  // Validate the Request Body
  if (!id || !title || !desc || !price) {
    return res.status(400).json({ error: 'All product properties must be provided' });
  }

  try {
    const database = client.db("Airbean");
    const menuCollection = database.collection("Menu");

    const newProduct = {
        id,
        title,
        desc,
        price,
        createdAt: new Date()
    };

    await menuCollection.insertOne(newProduct);

    // Respond to the Client
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Endpoint to modify a product
router.put('/modify-product/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, desc, price } = req.body;

  // Validate the Request Body
  if (!title || !desc || !price) {
    return res.status(400).json({ error: 'All product properties must be provided' });
  }

  try {
    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      { title, desc, price, modifiedAt: new Date() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond to the Client
    res.status(200).json({ message: 'Product modified successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error modifying product' });
  }
});

// Endpoint to delete a product
router.delete('/delete-product/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the product
    const deletedProduct = await Product.findOneAndDelete({ id });

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond to the Client
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;