const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

function parseOrder(row) {
  if (!row) return null;
  let items = [];
  let shipping_address = {};
  try { items = row.items ? JSON.parse(row.items) : []; } catch { /* */ }
  try { shipping_address = row.shipping_address ? JSON.parse(row.shipping_address) : {}; } catch { /* */ }
  return { ...row, items, shipping_address };
}

// POST /api/orders — create order (authenticated)
router.post('/', authenticate, (req, res) => {
  try {
    const { items, shipping_address, payment_method = 'mock' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate shipping address loosely
    if (!shipping_address || typeof shipping_address !== 'object') {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Resolve products and calculate total from DB prices
    let total = 0;
    const resolvedItems = [];

    for (const item of items) {
      const pid = item.product_id || item.productId;
      const qty = parseInt(item.quantity, 10);
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
        return res.status(400).json({ error: 'Quantity must be an integer between 1 and 10' });
      }
      const product = db.prepare('SELECT id, name, price, image_url, stock FROM products WHERE id = ?').get(pid);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${pid}` });
      }
      if (product.stock < qty) {
        return res.status(409).json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
      const lineTotal = product.price * qty;
      total += lineTotal;
      resolvedItems.push({ product_id: product.id, name: product.name, price: product.price, quantity: qty, lineTotal });
    }

    // Manual transaction using BEGIN/COMMIT (node:sqlite compatible)
    const orderId = uuidv4();
    db.exec('BEGIN');
    try {
      for (const item of resolvedItems) {
        const result = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
          .run(item.quantity, item.product_id, item.quantity);
        if (result.changes === 0) {
          db.exec('ROLLBACK');
          return res.status(409).json({ error: 'Insufficient stock' });
        }
      }
      db.prepare(
        'INSERT INTO orders (id, user_id, items, total, shipping_address, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(
        orderId, req.user.id, JSON.stringify(resolvedItems),
        parseFloat(total.toFixed(2)), JSON.stringify(shipping_address), payment_method, 'processing'
      );
      db.exec('COMMIT');
    } catch (txErr) {
      db.exec('ROLLBACK');
      throw txErr;
    }

    const order = parseOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders — list orders (own for user, all for admin)
router.get('/', authenticate, (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    let countRow, rows;
    if (req.user.role === 'admin') {
      countRow = db.prepare('SELECT COUNT(*) AS count FROM orders').get();
      rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
    } else {
      countRow = db.prepare('SELECT COUNT(*) AS count FROM orders WHERE user_id = ?').get(req.user.id);
      rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(req.user.id, limit, offset);
    }
    const orders = rows.map(parseOrder);
    const totalCount = countRow ? countRow.count : 0;
    return res.json({ orders, count: orders.length, totalCount, page, limit });
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// GET /api/orders/:id — single order
router.get('/:id', authenticate, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    return res.json({ order: parseOrder(row) });
  } catch (err) {
    console.error('Get order error:', err);
    return res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// PUT /api/orders/:id/status — admin update status
router.put('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    // Restore stock if cancelling
    if (status === 'cancelled' && existing.status !== 'cancelled') {
      const items = JSON.parse(existing.items || '[]');
      for (const item of items) {
        db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(item.quantity, item.product_id);
      }
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    const order = parseOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id));
    return res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Update order status error:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
