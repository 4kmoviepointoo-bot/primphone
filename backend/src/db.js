// Uses Node.js v22.5+ built-in node:sqlite — no native compilation needed!
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'primphone.db');
const db = new DatabaseSync(DB_PATH);

// Enable WAL + foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

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

  const products = [
    {
      id: uuidv4(), name: 'Pixel 9 Pro', brand: 'Google', model: 'Pixel 9 Pro',
      price: 1199, original_price: null, storage: '256GB', ram: '12GB', color: 'Obsidian',
      description: 'The most pro Pixel ever. With the best camera system in a Pixel phone, all-new Pixel Camera features, Gemini AI on device, and long-lasting battery.',
      specs: JSON.stringify({ display: '6.3 inch LTPO OLED', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
      badge: 'New', rating: 4.9, review_count: 2847, featured: 1,
    },
    {
      id: uuidv4(), name: 'Pixel 9 Pro XL', brand: 'Google', model: 'Pixel 9 Pro XL',
      price: 1299, original_price: null, storage: '256GB', ram: '16GB', color: 'Porcelain',
      description: 'The biggest, most powerful Pixel. Expansive display, massive battery, and the complete pro camera suite.',
      specs: JSON.stringify({ display: '6.8 inch LTPO OLED', processor: 'Google Tensor G4', battery: '5060 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
      badge: 'New', rating: 4.9, review_count: 1923, featured: 1,
    },
    {
      id: uuidv4(), name: 'Pixel 9', brand: 'Google', model: 'Pixel 9',
      price: 999, original_price: null, storage: '128GB', ram: '12GB', color: 'Wintergreen',
      description: 'Meet Pixel 9. A fresh new look with Gemini AI built in, powerful camera, and all-day battery life.',
      specs: JSON.stringify({ display: '6.3 inch OLED', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 10.5MP', os: 'Android 15', charging: '27W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
      badge: 'New', rating: 4.8, review_count: 3241, featured: 1,
    },
    {
      id: uuidv4(), name: 'Pixel 9a', brand: 'Google', model: 'Pixel 9a',
      price: 699, original_price: null, storage: '128GB', ram: '8GB', color: 'Iris',
      description: 'All the essentials of a Pixel at a great price. Impressive camera, long battery life, and clean Android.',
      specs: JSON.stringify({ display: '6.1 inch OLED', processor: 'Google Tensor G4', battery: '5100 mAh', camera: '48MP + 13MP', os: 'Android 15', charging: '18W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9a-1.jpg',
      badge: 'Best Value', rating: 4.7, review_count: 1456, featured: 0,
    },
    {
      id: uuidv4(), name: 'Pixel Fold 2', brand: 'Google', model: 'Pixel Fold 2',
      price: 1799, original_price: null, storage: '256GB', ram: '16GB', color: 'Obsidian',
      description: 'Unfold your world. The ultimate foldable phone with a seamless hinge, outer and inner displays, and pro-grade cameras.',
      specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G3', battery: '4650 mAh', camera: '48MP + 10.8MP + 10.8MP', os: 'Android 15', charging: '30W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
      badge: 'Foldable', rating: 4.8, review_count: 987, featured: 1,
    },
    {
      id: uuidv4(), name: 'Pixel 8 Pro', brand: 'Google', model: 'Pixel 8 Pro',
      price: 899, original_price: 1099, storage: '128GB', ram: '12GB', color: 'Bay',
      description: 'The ultimate Pixel flagship. With Google AI, the best Pixel camera, and a stunning display.',
      specs: JSON.stringify({ display: '6.7 inch LTPO OLED', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
      badge: 'Sale', rating: 4.8, review_count: 4123, featured: 0,
    },
    {
      id: uuidv4(), name: 'Pixel 8', brand: 'Google', model: 'Pixel 8',
      price: 699, original_price: 799, storage: '128GB', ram: '8GB', color: 'Rose',
      description: 'The power of Google AI in a sleek, compact design. Magic Eraser, Call Screen, and more.',
      specs: JSON.stringify({ display: '6.2 inch OLED', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
      badge: 'Sale', rating: 4.7, review_count: 5678, featured: 0,
    },
    {
      id: uuidv4(), name: 'Pixel 8a', brand: 'Google', model: 'Pixel 8a',
      price: 599, original_price: null, storage: '128GB', ram: '8GB', color: 'Obsidian',
      description: 'A-series meets Tensor G3. Great camera, long battery life, and Google AI at an accessible price.',
      specs: JSON.stringify({ display: '6.1 inch OLED', processor: 'Google Tensor G3', battery: '4492 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8a-1.jpg',
      badge: 'Popular', rating: 4.7, review_count: 2345, featured: 0,
    },
    {
      id: uuidv4(), name: 'Pixel 7 Pro', brand: 'Google', model: 'Pixel 7 Pro',
      price: 599, original_price: 899, storage: '128GB', ram: '12GB', color: 'Hazel',
      description: 'A sophisticated design, an advanced camera system, and Google Tensor G2 chip.',
      specs: JSON.stringify({ display: '6.7 inch LTPO OLED', processor: 'Google Tensor G2', battery: '5000 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 14', charging: '30W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-1.jpg',
      badge: 'Classic', rating: 4.6, review_count: 6789, featured: 0,
    },
    {
      id: uuidv4(), name: 'Pixel 7', brand: 'Google', model: 'Pixel 7',
      price: 399, original_price: 599, storage: '128GB', ram: '8GB', color: 'Lemongrass',
      description: 'The everyday flagship. Google Tensor G2, upgraded cameras, and all-day battery in a refined design.',
      specs: JSON.stringify({ display: '6.3 inch OLED', processor: 'Google Tensor G2', battery: '4355 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '20W Wired' }),
      stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-1.jpg',
      badge: 'Classic', rating: 4.5, review_count: 8912, featured: 0,
    },
  ];

  for (const p of products) {
    insert.run(
      p.id, p.name, p.brand, p.model, p.price, p.original_price,
      p.storage, p.ram, p.color, p.description, p.specs, p.stock,
      p.image_url, p.badge, p.rating, p.review_count, p.featured
    );
  }
  console.log('Seeded 10 Google Pixel products');
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
