const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Endpoint to add a new product
router.post('/add-product', async (req, res) => {
  const { id, title, desc, price } = req.body;

  // Validate the Request Body
  if (!id || !title || !desc || !price) {
    return res.status(400).json({ error: 'All product properties must be provided' });
  }

  try {
    // Insert the Product into MongoDB
    const newProduct = new Product({ id, title, desc, price });
    await newProduct.save();

    // Respond to the Client
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

module.exports = router;