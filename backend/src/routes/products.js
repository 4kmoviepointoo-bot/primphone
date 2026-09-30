const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Parse a product row from SQLite: converts specs JSON string and featured integer.
 */
function parseProduct(row) {
  if (!row) return null;
  return {
    ...row,
    specs: row.specs ? JSON.parse(row.specs) : {},
    featured: row.featured === 1,
  };
}

/**
 * GET /api/products
 * Query params: featured, search, brand, minPrice, maxPrice, sort
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const { featured, search, brand, minPrice, maxPrice, sort, category } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Category-specific filtering
    if (category) {
      const cat = category.toLowerCase().trim();
      if (cat === 'pixel-9') {
        query += " AND (model LIKE 'Pixel 9%' OR name LIKE 'Pixel 9%') AND name NOT LIKE '%Fold%' AND model NOT LIKE '%Fold%' AND model NOT LIKE '%9a%'";
      } else if (cat === 'foldable' || cat === 'foldables') {
        query += " AND (badge = 'Foldable' OR name LIKE '%Fold%' OR model LIKE '%Fold%')";
      } else if (cat === 'pixel-8') {
        query += " AND (model LIKE 'Pixel 8%' OR name LIKE 'Pixel 8%') AND model NOT LIKE '%8a%' AND name NOT LIKE '%8a%'";
      } else if (cat === 'a-series' || cat === 'pixel-a') {
        query += " AND (badge = 'A-Series' OR model LIKE '%9a%' OR model LIKE '%8a%' OR model LIKE '%7a%' OR model LIKE '%6a%')";
      } else if (cat === 'sale' || cat === 'special-offers') {
        query += " AND (badge = 'Sale' OR original_price IS NOT NULL)";
      } else if (cat === 'featured') {
        query += ' AND featured = 1';
      }
    }

    if (featured === 'true' && !category) {
      query += ' AND featured = 1';
    }

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR description LIKE ? OR model LIKE ? OR color LIKE ?)';
      const pattern = `%${search.trim()}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    if (brand && brand.trim()) {
      query += ' AND brand LIKE ?';
      params.push(`%${brand.trim()}%`);
    }

    if (req.query.badge && req.query.badge.trim() && !category) {
      const b = req.query.badge.trim();
      if (b.toLowerCase() === 'sale') {
        query += " AND (badge = 'Sale' OR original_price IS NOT NULL)";
      } else if (b.toLowerCase() === 'foldable') {
        query += " AND (badge = 'Foldable' OR name LIKE '%Fold%' OR model LIKE '%Fold%')";
      } else if (b.toLowerCase() === 'a-series') {
        query += " AND (badge = 'A-Series' OR model LIKE '%9a%' OR model LIKE '%8a%' OR model LIKE '%7a%' OR model LIKE '%6a%')";
      } else {
        query += ' AND badge LIKE ?';
        params.push(`%${b}%`);
      }
    }

    if (req.query.series && req.query.series.trim() && !category) {
      const s = req.query.series.trim();
      if (s === 'Pixel 9') {
        query += " AND (model LIKE 'Pixel 9%' OR name LIKE 'Pixel 9%') AND name NOT LIKE '%Fold%' AND model NOT LIKE '%Fold%' AND model NOT LIKE '%9a%'";
      } else if (s === 'Pixel 8') {
        query += " AND (model LIKE 'Pixel 8%' OR name LIKE 'Pixel 8%') AND model NOT LIKE '%8a%' AND name NOT LIKE '%8a%'";
      } else if (s === 'Pixel A-Series' || s === 'a-series') {
        query += " AND (badge = 'A-Series' OR model LIKE '%9a%' OR model LIKE '%8a%' OR model LIKE '%7a%' OR model LIKE '%6a%')";
      } else {
        query += ' AND (model LIKE ? OR name LIKE ?)';
        params.push(`%${s}%`, `%${s}%`);
      }
    }

    if (minPrice !== undefined && !isNaN(parseFloat(minPrice))) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(parseFloat(maxPrice))) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      default:
        query += ' ORDER BY featured DESC, created_at DESC';
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const offset = (page - 1) * limit;

    const countRow = db.prepare('SELECT COUNT(*) AS count FROM (' + query + ')').get(...params);
    const totalCount = countRow ? countRow.count : 0;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
    const products = rows.map(parseProduct);
    return res.json({ products, count: products.length, totalCount, page, limit });
  } catch (err) {
    console.error('Get products error:', err);
    try {
      const seedModule = require('../../seedAll');
      const fallbackProducts = (seedModule.products || []).map(parseProduct);
      return res.json({ products: fallbackProducts, count: fallbackProducts.length, totalCount: fallbackProducts.length, page: 1, limit: 50 });
    } catch {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
  }
});

/**
 * GET /api/products/:id
 * Returns single product by ID.
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ product: parseProduct(row) });
  } catch (err) {
    console.error('Get product error:', err);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

/**
 * POST /api/products
 * Admin only. Create a new product.
 */
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const {
      name, brand = 'Google', model, price, original_price,
      storage, ram, color, description, specs, stock = 10,
      image_url, badge, rating = 4.5, review_count = 0, featured = false,
    } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 200) {
      return res.status(400).json({ error: 'Product name must be 1-200 characters' });
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0 || parseFloat(price) > 999999) {
      return res.status(400).json({ error: 'Valid price is required (0-999999)' });
    }
    if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0 || parseInt(stock, 10) > 9999)) {
      return res.status(400).json({ error: 'Stock must be 0-9999' });
    }
    if (rating !== undefined && (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
      return res.status(400).json({ error: 'Rating must be 0-5' });
    }
    if (image_url !== undefined && image_url && !/^https?:\/\/.+/.test(image_url)) {
      return res.status(400).json({ error: 'Image URL must be a valid URL' });
    }

    const id = uuidv4();
    const specsJson = specs ? (typeof specs === 'object' ? JSON.stringify(specs) : specs) : null;

    db.prepare(`
      INSERT INTO products
        (id, name, brand, model, price, original_price, storage, ram, color, description, specs, stock, image_url, badge, rating, review_count, featured)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      brand,
      model || null,
      parseFloat(price),
      original_price ? parseFloat(original_price) : null,
      storage || null,
      ram || null,
      color || null,
      description || null,
      specsJson,
      parseInt(stock, 10),
      image_url || null,
      badge || null,
      parseFloat(rating),
      parseInt(review_count, 10),
      featured ? 1 : 0,
    );

    const product = parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Admin only. Update an existing product.
 */
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name, brand, model, price, original_price,
      storage, ram, color, description, specs, stock,
      image_url, badge, rating, review_count, featured,
    } = req.body;

    const updated = {
      name: name !== undefined ? name.trim() : existing.name,
      brand: brand !== undefined ? brand : existing.brand,
      model: model !== undefined ? model : existing.model,
      price: price !== undefined ? parseFloat(price) : existing.price,
      original_price: original_price !== undefined ? (original_price ? parseFloat(original_price) : null) : existing.original_price,
      storage: storage !== undefined ? storage : existing.storage,
      ram: ram !== undefined ? ram : existing.ram,
      color: color !== undefined ? color : existing.color,
      description: description !== undefined ? description : existing.description,
      specs: specs !== undefined
        ? (typeof specs === 'object' ? JSON.stringify(specs) : specs)
        : existing.specs,
      stock: stock !== undefined ? parseInt(stock, 10) : existing.stock,
      image_url: image_url !== undefined ? image_url : existing.image_url,
      badge: badge !== undefined ? badge : existing.badge,
      rating: rating !== undefined ? parseFloat(rating) : existing.rating,
      review_count: review_count !== undefined ? parseInt(review_count, 10) : existing.review_count,
      featured: featured !== undefined ? (featured ? 1 : 0) : existing.featured,
    };

    db.prepare(`
      UPDATE products SET
        name = ?, brand = ?, model = ?, price = ?, original_price = ?,
        storage = ?, ram = ?, color = ?, description = ?, specs = ?,
        stock = ?, image_url = ?, badge = ?, rating = ?, review_count = ?, featured = ?
      WHERE id = ?
    `).run(
      updated.name, updated.brand, updated.model, updated.price, updated.original_price,
      updated.storage, updated.ram, updated.color, updated.description, updated.specs,
      updated.stock, updated.image_url, updated.badge, updated.rating, updated.review_count,
      updated.featured, req.params.id,
    );

    const product = parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
    return res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Admin only. Delete a product.
 */
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * GET /api/products/:id/reviews
 * Get reviews for a product
 */
router.get('/:id/reviews', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(req.params.id);
    return res.json({ reviews: rows });
  } catch (err) {
    console.error('Get reviews error:', err);
    return res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

/**
 * POST /api/products/:id/reviews
 * Add a review for a product (authenticated)
 */
router.post('/:id/reviews', authenticate, (req, res) => {
  try {
    const { user_name, rating, comment } = req.body;

    if (!user_name || typeof user_name !== 'string' || user_name.trim().length < 2 || user_name.trim().length > 100) {
      return res.status(400).json({ error: 'Name must be 2-100 characters' });
    }
    const ratingNum = parseInt(rating, 10);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length < 10 || comment.trim().length > 500) {
      return res.status(400).json({ error: 'Comment must be 10-500 characters' });
    }

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const sanitizedName = user_name.trim().replace(/[<>]/g, '');
    const sanitizedComment = comment.trim().replace(/[<>]/g, '');

    const reviewId = uuidv4();
    db.prepare(`
      INSERT INTO reviews (id, product_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(reviewId, req.params.id, sanitizedName, ratingNum, sanitizedComment);

    const prod = db.prepare('SELECT rating, review_count FROM products WHERE id = ?').get(req.params.id);
    if (prod) {
      const newCount = prod.review_count + 1;
      const newRating = ((prod.rating * prod.review_count) + ratingNum) / newCount;
      db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?')
        .run(newRating, newCount, req.params.id);
    }

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
    return res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (err) {
    console.error('Create review error:', err);
    return res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;
