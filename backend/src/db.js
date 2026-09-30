// Uses Node.js v22.5+ built-in node:sqlite — no native compilation needed!
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_PATH = isVercel
  ? path.join('/tmp', 'primphone.db')
  : path.join(__dirname, '..', 'primphone.db');

const db = new DatabaseSync(DB_PATH);

// Enable WAL + foreign keys resiliently
try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch {
  try {
    db.exec('PRAGMA journal_mode = MEMORY;');
  } catch {}
}

try {
  db.exec('PRAGMA foreign_keys = ON;');
} catch {}

function initialize() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT DEFAULT 'Google',
      model TEXT,
      price REAL NOT NULL CHECK(price >= 0),
      original_price REAL,
      storage TEXT,
      ram TEXT,
      color TEXT,
      description TEXT,
      specs TEXT,
      stock INTEGER DEFAULT 10 CHECK(stock >= 0),
      image_url TEXT,
      badge TEXT,
      rating REAL DEFAULT 4.5 CHECK(rating >= 0 AND rating <= 5),
      review_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT DEFAULT 'mock',
      status TEXT DEFAULT 'processing' CHECK(status IN ('processing', 'shipped', 'delivered', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  `);

  seedProducts();
  seedAdmin();
  seedReviews();
  console.log('Database initialized successfully');
}

function seedProducts() {
  const row = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (row.count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products
      (id, name, brand, model, price, original_price, storage, ram, color, description, specs, stock, image_url, badge, rating, review_count, featured)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let products = [];
  try {
    const seedModule = require('../seedAll');
    products = seedModule.products || [];
  } catch (err) {
    console.error('Error importing seedAll products:', err);
  }

  for (const p of products) {
    insert.run(
      p.id, p.name, p.brand, p.model, p.price, p.original_price,
      p.storage, p.ram, p.color, p.description, p.specs, p.stock,
      p.image_url, p.badge, p.rating, p.review_count, p.featured
    );
  }
  console.log(`Seeded ${products.length} Google Pixel products`);
}

function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@primphone.com';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (existing) return;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('WARNING: ADMIN_PASSWORD not set. Admin user will not be created.');
    return;
  }
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
    .run(uuidv4(), 'Admin', adminEmail, hashedPassword, 'admin');
  console.log('Seeded admin user');
}

function seedReviews() {
  const row = db.prepare('SELECT COUNT(*) AS count FROM reviews').get();
  if (row.count > 0) return;

  const products = db.prepare('SELECT id, name FROM products').all();
  if (!products || products.length === 0) return;

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, product_id, user_name, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const sampleReviews = {
    'Pixel 9 Pro XL': [
      { name: 'Marcus Vance', rating: 5, days: '-2 days', comment: 'The Tensor G4 and Super Actua display are unbelievable. Low-light photography destroys my previous phone. Battery easily delivers over 1.5 days of heavy use.' },
      { name: 'Sophia Chen', rating: 5, days: '-5 days', comment: 'Hands down the most luxurious Android flagship I have ever held. The Porcelain finish feels silky smooth and Gemini AI features are genuinely helpful.' },
      { name: 'Julian Reed', rating: 5, days: '-12 days', comment: 'The 5x optical telephoto and 30x Super Res Zoom are mind-blowing. Sound quality through the stereo speakers is crisp and punchy. Highly recommended!' },
      { name: 'David M.', rating: 4, days: '-20 days', comment: 'Spectacular hardware, premium build quality, and fluid 120Hz LTPO display. Arrived in pristine luxury packaging.' }
    ],
    'Pixel 9 Pro': [
      { name: 'Elena Rostova', rating: 5, days: '-3 days', comment: 'Finally a compact pro device! Having the full triple pro camera system in a comfortable 6.3-inch form factor is perfection.' },
      { name: 'Liam Thorne', rating: 5, days: '-8 days', comment: 'Display is astonishingly bright even under blazing direct sunlight. Tensor G4 thermal performance is much cooler than previous generations.' },
      { name: 'Amira K.', rating: 5, days: '-15 days', comment: 'The camera processing speed is instant. Magic Editor and Add Me are pure technological wizardry.' }
    ],
    'Pixel Fold 2': [
      { name: 'Alexander Wright', rating: 5, days: '-4 days', comment: 'The hinge engineering is an absolute marvel. Opens completely flat, inner crease is virtually invisible in daily use, and multitasking is unmatched.' },
      { name: 'Chloe Laurent', rating: 5, days: '-10 days', comment: 'Luxury foldable at its absolute finest. Reading documents and watching HDR media on the 8-inch canvas is unbelievable.' }
    ],
    'Pixel 9': [
      { name: 'Oliver Scott', rating: 5, days: '-6 days', comment: 'The Wintergreen color is stunning in person. Incredible performance, all-day battery, and clean Android 15.' }
    ]
  };

  for (const prod of products) {
    const list = sampleReviews[prod.name] || [
      { name: 'Verified Customer', rating: 5, days: '-7 days', comment: 'Incredible Google Pixel experience. The camera and battery life are top tier.' },
      { name: 'Verified Enthusiast', rating: 5, days: '-14 days', comment: 'Fast delivery from PrimePhone and authentic device in sealed packaging. 10/10 service.' }
    ];
    for (const r of list) {
      insertReview.run(uuidv4(), prod.id, r.name, r.rating, r.comment, r.days);
    }
  }
  console.log('Seeded customer reviews successfully');
}

module.exports = { db, initialize };
