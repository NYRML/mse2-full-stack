const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// Create item (POST /api/items)
router.post('/', auth, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    const newItem = new Item({
      itemName, description, type, location, date, contactInfo,
      user: req.user.id
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Get all items (GET /api/items) - public? But exam says only logged-in users view dashboard, so protect
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID' });
  }
});

// Update item (only if user owns it)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: you can only update your own items' });
    }
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete item (only if user owns it)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;