const express = require('express');
const { requireAuth } = require('@clerk/express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// List all products (marketplace)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer').sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product detail
// Farmer: list my products or buyer: list all marketplace
router.get('/products/my', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const me = await User.findOne({ clerkId });
    if (!me) return res.status(404).json({ error: 'User not found' });

    if (me.role === 'farmer') {
      const products = await Product.find({ farmer: me._id }).populate('farmer').lean();
      return res.json(products);
    }

    // buyers/admin -> return marketplace
    const products = await Product.find().populate('farmer').lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product detail
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer').lean();
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (farmer)
router.post('/products', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const me = await User.findOne({ clerkId });
    if (!me) return res.status(404).json({ error: 'User not found' });
    // Only verified farmers can create products
    if (me.role !== 'farmer') return res.status(403).json({ error: 'Only farmers can create products' });
    if (!me.verified) return res.status(403).json({ error: 'Farmer account not verified' });

    const { name, batchCode, harvestDate, description, category, availableUnits, unit, pricePerUnit, images, shelfLife, qualityGrade } = req.body;
    const product = await Product.create({
      farmer: me._id,
      name,
      batchCode,
      harvestDate: new Date(harvestDate),
      description,
      category,
      availableUnits,
      unit,
      pricePerUnit,
      images: images || [],
      shelfLife,
      qualityGrade,
      adminVerified: false
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (farmer owner can update their product)
router.put('/products/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const me = await User.findOne({ clerkId });
    if (!me) return res.status(404).json({ error: 'User not found' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Only the farmer who owns the product can update it
    if (me.role !== 'farmer' || product.farmer.toString() !== me._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatable = ['name','batchCode','harvestDate','description','category','availableUnits','unit','pricePerUnit','images','shelfLife','qualityGrade'];
    updatable.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    const populated = await Product.findById(product._id).populate('farmer').lean();
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (owner farmer or admin)
router.delete('/products/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const me = await User.findOne({ clerkId });
    if (!me) return res.status(404).json({ error: 'User not found' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // allow admin to delete or farmer owner
    if (me.role === 'admin' || (me.role === 'farmer' && product.farmer.toString() === me._id.toString())) {
      // Use findByIdAndDelete to ensure deletion works regardless of whether `product` is a document or a plain object
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ ok: true });
    }

    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders: place order
router.post('/orders', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const buyer = await User.findOne({ clerkId });
    if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId).populate('farmer');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.availableUnits < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const totalAmount = quantity * product.pricePerUnit;
    const order = await Order.create({
      buyer: buyer._id,
      farmer: product.farmer._id,
      product: product._id,
      quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      totalAmount,
      status: 'pending'
    });

    // decrement stock (simple approach)
    product.availableUnits = product.availableUnits - quantity;
    await product.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders: get my orders
router.get('/orders/my', requireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const me = await User.findOne({ clerkId });
    if (!me) return res.status(404).json({ error: 'User not found' });

    let orders;
    if (me.role === 'farmer') {
      orders = await Order.find({ farmer: me._id }).populate('product buyer farmer').sort({ createdAt: -1 }).lean();
    } else if (me.role === 'buyer') {
      orders = await Order.find({ buyer: me._id }).populate('product buyer farmer').sort({ createdAt: -1 }).lean();
    } else {
      // admin -> all orders
      orders = await Order.find().populate('product buyer farmer').sort({ createdAt: -1 }).lean();
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
