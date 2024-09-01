const express = require('express');
const router = express.Router();
const { client } = require('../config/database');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const { ObjectId } = require('mongodb');

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

  // Build the update object dynamically
  const updateFields = {};
  if (title) updateFields.title = title;
  if (desc) updateFields.desc = desc;
  if (price) updateFields.price = price;
  updateFields.modifiedAt = new Date(); // Always update the modifiedAt field

  // Check if there are any fields to update
  if (Object.keys(updateFields).length === 1) { // Only modifiedAt is present
    return res.status(400).json({ error: 'At least one product property must be provided' });
  }

  try {
    const database = client.db("Airbean");
    const menuCollection = database.collection("Menu");

    const allDocuments = await menuCollection.find({}).toArray();
    console.log('All Documents in Menu Collection:', allDocuments);

    // Determine the query based on whether the id is a valid ObjectId
    const query = ObjectId.isValid(id) 
      ? { _id: new ObjectId(id) } 
      : { $or: [{ id: id }, { id: parseInt(id, 10) }] };
    console.log('Modify Product Query:', query);

    // Find and update the product
    const updatedProduct = await menuCollection.findOneAndUpdate(query,
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    console.log('Updated Product:', updatedProduct);

    if (!updatedProduct.value) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond to the Client
    res.status(200).json({ message: 'Product modified successfully', product: updatedProduct.value });
  } catch (error) {
    console.error('Error modifying product:', error);
    res.status(500).json({ error: 'Error modifying product' });
  }
});

// Endpoint to delete a product
router.delete('/delete-product/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const database = client.db("Airbean");
    const menuCollection = database.collection("Menu");

    // Determine the query based on whether the id is a valid ObjectId
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    console.log('Delete Product Query:', query);

    // Find and delete the product
    const deletedProduct = await menuCollection.findOneAndDelete(query);
    console.log('Deleted Product:', deletedProduct);

    if (!deletedProduct.value) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond to the Client
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Endpoint to add a campaign offer
router.post('/add-campaign', authenticateAdmin, async (req, res) => {
  const { products, campaignPrice } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0 || !campaignPrice) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const database = client.db("Airbean");
    const menuCollection = database.collection("Menu");
    const campaignsCollection = database.collection("Campaigns");

    // Validate that all products exist
    const productIds = products.map(product => ObjectId.isValid(product) ? new ObjectId(product) : product);
    const existingProducts = await menuCollection.find({ _id: { $in: productIds } }).toArray();

    if (existingProducts.length !== products.length) {
      return res.status(404).json({ error: 'One or more products not found' });
    }

    // Create the campaign offer
    const campaign = {
      products: existingProducts.map(product => product._id),
      campaignPrice,
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    // Save the campaign offer to the database
    const result = await campaignsCollection.insertOne(campaign);

    // Respond to the client
    res.status(201).json({ message: 'Campaign added successfully', campaignId: result.insertedId });
  } catch (error) {
    console.error('Error adding campaign:', error);
    res.status(500).json({ error: 'Error adding campaign' });
  }
});

module.exports = router;