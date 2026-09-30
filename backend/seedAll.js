const { db } = require('./src/db');
const { v4: uuidv4 } = require('uuid');

const products = [
  // ─── 1. PIXEL 9 SERIES (10 Products) ───
  {
    id: uuidv4(), name: 'Pixel 9 Pro Obsidian', brand: 'Google', model: 'Pixel 9 Pro',
    price: 1199, original_price: null, storage: '256GB', ram: '16GB', color: 'Obsidian',
    description: 'The most pro Pixel ever. Google Tensor G4 with 16GB RAM for on-device Gemini AI and pro triple cameras.',
    specs: JSON.stringify({ display: '6.3 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 15, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    badge: 'New', rating: 4.9, review_count: 2847, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro Porcelain', brand: 'Google', model: 'Pixel 9 Pro',
    price: 1199, original_price: null, storage: '256GB', ram: '16GB', color: 'Porcelain',
    description: 'Polished metal frame and matte glass finish in pure Porcelain. Gemini Live built-in.',
    specs: JSON.stringify({ display: '6.3 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 12, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    badge: 'New', rating: 4.9, review_count: 1420, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro Hazel', brand: 'Google', model: 'Pixel 9 Pro',
    price: 1399, original_price: null, storage: '512GB', ram: '16GB', color: 'Hazel',
    description: 'Expansive 512GB storage in elegant metallic Hazel finish. Pro camera controls and 8K Video Boost.',
    specs: JSON.stringify({ display: '6.3 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 8, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    badge: 'New', rating: 4.9, review_count: 890, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro Rose Quartz', brand: 'Google', model: 'Pixel 9 Pro',
    price: 1199, original_price: null, storage: '256GB', ram: '16GB', color: 'Rose Quartz',
    description: 'Stunning luxury Rose Quartz matte finish with aerospace aluminum frame and scratch-resistant Gorilla Glass Victus 2.',
    specs: JSON.stringify({ display: '6.3 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    badge: 'New', rating: 4.8, review_count: 654, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro XL Porcelain', brand: 'Google', model: 'Pixel 9 Pro XL',
    price: 1299, original_price: null, storage: '256GB', ram: '16GB', color: 'Porcelain',
    description: 'The ultimate flagship with a huge 6.8 inch Super Actua display, rapid 45W charging, and 5060 mAh battery.',
    specs: JSON.stringify({ display: '6.8 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '5060 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 20, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
    badge: 'Flagship', rating: 4.9, review_count: 1923, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro XL Obsidian', brand: 'Google', model: 'Pixel 9 Pro XL',
    price: 1499, original_price: null, storage: '512GB', ram: '16GB', color: 'Obsidian',
    description: 'Maximum power and storage in stealth Obsidian. Best camera zoom in any smartphone up to 30x Super Res Zoom.',
    specs: JSON.stringify({ display: '6.8 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '5060 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 14, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
    badge: 'Flagship', rating: 4.9, review_count: 1120, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro XL Hazel 1TB', brand: 'Google', model: 'Pixel 9 Pro XL',
    price: 1699, original_price: null, storage: '1TB', ram: '16GB', color: 'Hazel',
    description: 'Ultimate enthusiast edition with 1 Terabyte of internal storage. Capture endless 8K HDR videos.',
    specs: JSON.stringify({ display: '6.8 inch Super Actua OLED (1-120Hz)', processor: 'Google Tensor G4', battery: '5060 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 6, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
    badge: 'Limited', rating: 5.0, review_count: 421, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9 Wintergreen', brand: 'Google', model: 'Pixel 9',
    price: 999, original_price: null, storage: '128GB', ram: '12GB', color: 'Wintergreen',
    description: 'Fresh design with dual camera system, Macro Focus, Magic Editor with Reimagine, and 12GB RAM.',
    specs: JSON.stringify({ display: '6.3 inch Actua OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP', os: 'Android 15', charging: '27W Wired' }),
    stock: 25, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
    badge: 'New', rating: 4.8, review_count: 3241, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Peony', brand: 'Google', model: 'Pixel 9',
    price: 999, original_price: null, storage: '128GB', ram: '12GB', color: 'Peony',
    description: 'Vibrant Peony pink colorway with polished glass back and satin metal finish. Gemini AI built-in.',
    specs: JSON.stringify({ display: '6.3 inch Actua OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP', os: 'Android 15', charging: '27W Wired' }),
    stock: 18, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
    badge: 'New', rating: 4.8, review_count: 1789, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9 Obsidian 256GB', brand: 'Google', model: 'Pixel 9',
    price: 1099, original_price: null, storage: '256GB', ram: '12GB', color: 'Obsidian',
    description: 'Classic Obsidian black with double storage capacity. 24-hour battery life and 7 years of Pixel drops.',
    specs: JSON.stringify({ display: '6.3 inch Actua OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP', os: 'Android 15', charging: '27W Wired' }),
    stock: 22, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
    badge: 'Popular', rating: 4.8, review_count: 2130, featured: 0
  },

  // ─── 2. FOLDABLES (10 Products) ───
  {
    id: uuidv4(), name: 'Pixel 9 Pro Fold Obsidian', brand: 'Google', model: 'Pixel 9 Pro Fold',
    price: 1799, original_price: null, storage: '256GB', ram: '16GB', color: 'Obsidian',
    description: 'The thinnest foldable phone with the largest 8-inch Super Actua Flex inner display and gear-free fluid hinge.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4650 mAh', camera: '48MP + 10.8MP + 10.5MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.9, review_count: 987, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9 Pro Fold Porcelain', brand: 'Google', model: 'Pixel 9 Pro Fold',
    price: 1919, original_price: null, storage: '512GB', ram: '16GB', color: 'Porcelain',
    description: 'Porcelain white foldable with 512GB storage. Multitask with Split Screen and Drag & Drop AI tools.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4650 mAh', camera: '48MP + 10.8MP + 10.5MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 7, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.9, review_count: 532, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel Fold 2 Obsidian', brand: 'Google', model: 'Pixel Fold 2',
    price: 1749, original_price: 1899, storage: '256GB', ram: '16GB', color: 'Obsidian',
    description: 'Second generation Google Foldable with zero gap design, IPX8 water resistance, and triple cameras.',
    specs: JSON.stringify({ display: '7.9 inch inner + 6.2 inch outer OLED', processor: 'Google Tensor G4', battery: '4800 mAh', camera: '48MP + 10.8MP + 10.8MP', os: 'Android 15', charging: '30W Wired' }),
    stock: 12, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.8, review_count: 764, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Studio Edition', brand: 'Google', model: 'Pixel Fold Studio',
    price: 1899, original_price: null, storage: '512GB', ram: '16GB', color: 'Matte Hazel',
    description: 'Created for creative professionals. Dual screen preview for video directors and photography studio mode.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 10.8MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 5, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.9, review_count: 312, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Carbon Edition', brand: 'Google', model: 'Pixel Fold Carbon',
    price: 1849, original_price: 1999, storage: '512GB', ram: '16GB', color: 'Carbon Black',
    description: 'Reinforced carbon-fiber hinge mechanism with aerospace titanium alloy casing for maximum durability.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4750 mAh', camera: '48MP + 12MP + 10.8MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 8, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.8, review_count: 445, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Dual SIM Edition', brand: 'Google', model: 'Pixel Fold Dual',
    price: 1699, original_price: 1799, storage: '256GB', ram: '12GB', color: 'Obsidian',
    description: 'Unlocked global dual SIM connectivity with worldwide 5G bands and enterprise security chip Titan M2.',
    specs: JSON.stringify({ display: '7.6 inch inner + 5.8 inch outer OLED', processor: 'Google Tensor G3', battery: '4821 mAh', camera: '48MP + 10.8MP + 10.8MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 11, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-fold-1.jpg',
    badge: 'Foldable', rating: 4.7, review_count: 890, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Porcelain 256GB', brand: 'Google', model: 'Pixel Fold',
    price: 1499, original_price: 1799, storage: '256GB', ram: '12GB', color: 'Porcelain',
    description: 'Original Google Pixel Fold in pristine Porcelain. Unfold into tabletop mode for hands-free video calls.',
    specs: JSON.stringify({ display: '7.6 inch inner + 5.8 inch outer OLED', processor: 'Google Tensor G2', battery: '4821 mAh', camera: '48MP + 10.8MP + 10.8MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 9, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-fold-1.jpg',
    badge: 'Foldable', rating: 4.7, review_count: 1205, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Obsidian 512GB', brand: 'Google', model: 'Pixel Fold',
    price: 1599, original_price: 1919, storage: '512GB', ram: '12GB', color: 'Obsidian',
    description: 'High capacity first generation Pixel Fold with massive 512GB internal storage and continuous display handoff.',
    specs: JSON.stringify({ display: '7.6 inch inner + 5.8 inch outer OLED', processor: 'Google Tensor G2', battery: '4821 mAh', camera: '48MP + 10.8MP + 10.8MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 6, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-fold-1.jpg',
    badge: 'Foldable', rating: 4.7, review_count: 940, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Enterprise Edition', brand: 'Google', model: 'Pixel Fold Enterprise',
    price: 1799, original_price: null, storage: '512GB', ram: '16GB', color: 'Obsidian',
    description: 'Pre-configured with zero-touch enrollment and 5 years of guaranteed security updates for business leaders.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4650 mAh', camera: '48MP + 10.8MP + 10.5MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 15, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 4.9, review_count: 320, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel Fold Ultra Moonstone', brand: 'Google', model: 'Pixel Fold Ultra',
    price: 2099, original_price: null, storage: '1TB', ram: '16GB', color: 'Moonstone',
    description: 'Collector edition with custom iridescent ceramic backplate, 1TB NVMe storage, and concierge VIP service.',
    specs: JSON.stringify({ display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G4', battery: '4800 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 15', charging: '45W Wired' }),
    stock: 4, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable', rating: 5.0, review_count: 180, featured: 0
  },

  // ─── 3. PIXEL 8 SERIES (10 Products) ───
  {
    id: uuidv4(), name: 'Pixel 8 Pro Bay', brand: 'Google', model: 'Pixel 8 Pro',
    price: 899, original_price: 1099, storage: '128GB', ram: '12GB', color: 'Bay',
    description: 'Iconic Bay blue flagship with Google Tensor G3, temperature sensor, and Super Actua LTPO display.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED (1-120Hz)', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 18, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    badge: 'Sale', rating: 4.8, review_count: 4123, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 8 Pro Obsidian', brand: 'Google', model: 'Pixel 8 Pro',
    price: 999, original_price: 1199, storage: '256GB', ram: '12GB', color: 'Obsidian',
    description: 'Sleek matte glass rear in Obsidian black with 256GB storage. Best Take and Audio Magic Eraser.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED (1-120Hz)', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 15, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    badge: 'Sale', rating: 4.8, review_count: 3100, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Pro Porcelain', brand: 'Google', model: 'Pixel 8 Pro',
    price: 899, original_price: 1099, storage: '128GB', ram: '12GB', color: 'Porcelain',
    description: 'Elegant warm white finish with polished champagne metal camera visor and 5x optical telephoto lens.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED (1-120Hz)', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 12, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    badge: 'Sale', rating: 4.8, review_count: 2450, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Pro Mint', brand: 'Google', model: 'Pixel 8 Pro',
    price: 949, original_price: 1149, storage: '128GB', ram: '12GB', color: 'Mint',
    description: 'Special edition Mint green colorway. All the pro power of Pixel 8 Pro in an exclusive shade.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED (1-120Hz)', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 9, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    badge: 'Special Edition', rating: 4.9, review_count: 1520, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Rose', brand: 'Google', model: 'Pixel 8',
    price: 699, original_price: 799, storage: '128GB', ram: '8GB', color: 'Rose',
    description: 'Compact 6.2 inch form factor in Rose pink. Everyday flagship power with Tensor G3 chip.',
    specs: JSON.stringify({ display: '6.2 inch OLED (60-120Hz)', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
    stock: 22, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    badge: 'Sale', rating: 4.7, review_count: 5678, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Hazel', brand: 'Google', model: 'Pixel 8',
    price: 699, original_price: 799, storage: '128GB', ram: '8GB', color: 'Hazel',
    description: 'Sophisticated sage Hazel green with satin aluminum frame. Fast wireless and wired charging.',
    specs: JSON.stringify({ display: '6.2 inch OLED (60-120Hz)', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
    stock: 19, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    badge: 'Sale', rating: 4.7, review_count: 3890, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Obsidian 128GB', brand: 'Google', model: 'Pixel 8',
    price: 699, original_price: 799, storage: '128GB', ram: '8GB', color: 'Obsidian',
    description: 'Midnight Obsidian finish. Night Sight, Face Unblur, and Real Tone algorithms for authentic portraits.',
    specs: JSON.stringify({ display: '6.2 inch OLED (60-120Hz)', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
    stock: 24, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    badge: 'Sale', rating: 4.7, review_count: 4210, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Mint', brand: 'Google', model: 'Pixel 8',
    price: 699, original_price: 799, storage: '128GB', ram: '8GB', color: 'Mint',
    description: 'Refreshing pastel Mint green. Smooth 120Hz Actua display with 2000 nits peak outdoor brightness.',
    specs: JSON.stringify({ display: '6.2 inch OLED (60-120Hz)', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
    stock: 14, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    badge: 'Sale', rating: 4.8, review_count: 2100, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Pro 512GB Obsidian', brand: 'Google', model: 'Pixel 8 Pro',
    price: 1149, original_price: 1299, storage: '512GB', ram: '12GB', color: 'Obsidian',
    description: 'Huge 512GB storage capacity for mobile photographers shooting uncompressed RAW files.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED (1-120Hz)', processor: 'Google Tensor G3', battery: '5050 mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 10, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    badge: 'Sale', rating: 4.9, review_count: 980, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8 Obsidian 256GB', brand: 'Google', model: 'Pixel 8',
    price: 759, original_price: 859, storage: '256GB', ram: '8GB', color: 'Obsidian',
    description: 'Double storage capacity with 256GB. Keep all your high resolution 4K 60fps family videos.',
    specs: JSON.stringify({ display: '6.2 inch OLED (60-120Hz)', processor: 'Google Tensor G3', battery: '4575 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '27W Wired' }),
    stock: 16, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    badge: 'Sale', rating: 4.8, review_count: 1840, featured: 0
  },

  // ─── 4. PIXEL A-SERIES (10 Products) ───
  {
    id: uuidv4(), name: 'Pixel 9a Iris', brand: 'Google', model: 'Pixel 9a',
    price: 699, original_price: null, storage: '128GB', ram: '8GB', color: 'Iris',
    description: 'Brand new Pixel 9a in Iris blue with flush rear camera glass and Google Tensor G4 AI chip.',
    specs: JSON.stringify({ display: '6.1 inch OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '5100 mAh', camera: '48MP + 13MP', os: 'Android 15', charging: '18W Wired' }),
    stock: 25, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9a-1.jpg',
    badge: 'A-Series', rating: 4.8, review_count: 1456, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 9a Obsidian', brand: 'Google', model: 'Pixel 9a',
    price: 759, original_price: null, storage: '256GB', ram: '8GB', color: 'Obsidian',
    description: 'Extra storage 256GB edition in timeless matte Obsidian. Massive 5100 mAh battery for 2+ day life.',
    specs: JSON.stringify({ display: '6.1 inch OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '5100 mAh', camera: '48MP + 13MP', os: 'Android 15', charging: '18W Wired' }),
    stock: 20, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9a-1.jpg',
    badge: 'A-Series', rating: 4.8, review_count: 980, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9a Porcelain', brand: 'Google', model: 'Pixel 9a',
    price: 699, original_price: null, storage: '128GB', ram: '8GB', color: 'Porcelain',
    description: 'Clean modern aesthetic in Porcelain white with full IP68 water and dust protection.',
    specs: JSON.stringify({ display: '6.1 inch OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '5100 mAh', camera: '48MP + 13MP', os: 'Android 15', charging: '18W Wired' }),
    stock: 18, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9a-1.jpg',
    badge: 'A-Series', rating: 4.8, review_count: 820, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 9a Peony', brand: 'Google', model: 'Pixel 9a',
    price: 699, original_price: null, storage: '128GB', ram: '8GB', color: 'Peony',
    description: 'Playful and bright Peony pink with rounded corners and satin-matte finish.',
    specs: JSON.stringify({ display: '6.1 inch OLED (60-120Hz)', processor: 'Google Tensor G4', battery: '5100 mAh', camera: '48MP + 13MP', os: 'Android 15', charging: '18W Wired' }),
    stock: 15, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9a-1.jpg',
    badge: 'A-Series', rating: 4.7, review_count: 670, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8a Aloe', brand: 'Google', model: 'Pixel 8a',
    price: 599, original_price: null, storage: '128GB', ram: '8GB', color: 'Aloe',
    description: 'Limited edition electric Aloe lime green with Tensor G3 chip and 120Hz Actua display.',
    specs: JSON.stringify({ display: '6.1 inch OLED (120Hz)', processor: 'Google Tensor G3', battery: '4492 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 20, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8a-1.jpg',
    badge: 'A-Series', rating: 4.8, review_count: 2345, featured: 1
  },
  {
    id: uuidv4(), name: 'Pixel 8a Bay', brand: 'Google', model: 'Pixel 8a',
    price: 599, original_price: null, storage: '128GB', ram: '8GB', color: 'Bay',
    description: 'Calm Bay blue with textured matte composite back and aluminum frame.',
    specs: JSON.stringify({ display: '6.1 inch OLED (120Hz)', processor: 'Google Tensor G3', battery: '4492 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 22, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8a-1.jpg',
    badge: 'A-Series', rating: 4.7, review_count: 1890, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8a Obsidian 256GB', brand: 'Google', model: 'Pixel 8a',
    price: 659, original_price: null, storage: '256GB', ram: '8GB', color: 'Obsidian',
    description: 'Maximum storage 256GB configuration in stealth Obsidian. Titan M2 co-processor security.',
    specs: JSON.stringify({ display: '6.1 inch OLED (120Hz)', processor: 'Google Tensor G3', battery: '4492 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 17, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8a-1.jpg',
    badge: 'A-Series', rating: 4.8, review_count: 1420, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 8a Porcelain', brand: 'Google', model: 'Pixel 8a',
    price: 599, original_price: null, storage: '128GB', ram: '8GB', color: 'Porcelain',
    description: 'Clean Porcelain white with 64MP quad-PD main sensor and 13MP ultra-wide lens.',
    specs: JSON.stringify({ display: '6.1 inch OLED (120Hz)', processor: 'Google Tensor G3', battery: '4492 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 19, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8a-1.jpg',
    badge: 'A-Series', rating: 4.7, review_count: 1650, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7a Sea', brand: 'Google', model: 'Pixel 7a',
    price: 449, original_price: 499, storage: '128GB', ram: '8GB', color: 'Sea',
    description: 'Light pale blue Sea edition powered by Tensor G2 with wireless charging support.',
    specs: JSON.stringify({ display: '6.1 inch OLED (90Hz)', processor: 'Google Tensor G2', battery: '4385 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 16, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-1.jpg',
    badge: 'A-Series', rating: 4.7, review_count: 4890, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7a Charcoal', brand: 'Google', model: 'Pixel 7a',
    price: 449, original_price: 499, storage: '128GB', ram: '8GB', color: 'Charcoal',
    description: 'Great everyday reliability with clean stock Android, clear calling, and Super Res Zoom.',
    specs: JSON.stringify({ display: '6.1 inch OLED (90Hz)', processor: 'Google Tensor G2', battery: '4385 mAh', camera: '64MP + 13MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 14, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-1.jpg',
    badge: 'A-Series', rating: 4.6, review_count: 5120, featured: 0
  },

  // ─── 5. SPECIAL OFFERS / SALE (10 Products) ───
  {
    id: uuidv4(), name: 'Pixel 7 Pro Hazel', brand: 'Google', model: 'Pixel 7 Pro',
    price: 599, original_price: 899, storage: '128GB', ram: '12GB', color: 'Hazel',
    description: 'A sophisticated design, an advanced camera system, and Google Tensor G2 chip at $300 discount.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED', processor: 'Google Tensor G2', battery: '5000 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 11, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-1.jpg',
    badge: 'Sale', rating: 4.6, review_count: 6789, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7 Pro Obsidian', brand: 'Google', model: 'Pixel 7 Pro',
    price: 649, original_price: 999, storage: '256GB', ram: '12GB', color: 'Obsidian',
    description: 'Premium glass with polished aluminum frame in Obsidian black with $350 savings.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED', processor: 'Google Tensor G2', battery: '5000 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 14, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-1.jpg',
    badge: 'Sale', rating: 4.6, review_count: 4320, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7 Pro Snow', brand: 'Google', model: 'Pixel 7 Pro',
    price: 599, original_price: 899, storage: '128GB', ram: '12GB', color: 'Snow',
    description: 'Pure Snow white with silver aluminum camera bar. Advanced telephoto and cinematic blur.',
    specs: JSON.stringify({ display: '6.7 inch LTPO OLED', processor: 'Google Tensor G2', battery: '5000 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 14', charging: '30W Wired' }),
    stock: 9, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-1.jpg',
    badge: 'Sale', rating: 4.6, review_count: 3890, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7 Lemongrass', brand: 'Google', model: 'Pixel 7',
    price: 399, original_price: 599, storage: '128GB', ram: '8GB', color: 'Lemongrass',
    description: 'The everyday flagship at an unbeatable clearance price of $399. All-day battery and dual cameras.',
    specs: JSON.stringify({ display: '6.3 inch OLED', processor: 'Google Tensor G2', battery: '4355 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '20W Wired' }),
    stock: 20, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-1.jpg',
    badge: 'Sale', rating: 4.5, review_count: 8912, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7 Obsidian', brand: 'Google', model: 'Pixel 7',
    price: 399, original_price: 599, storage: '128GB', ram: '8GB', color: 'Obsidian',
    description: 'Clean minimalist Obsidian finish with 50MP main sensor and Magic Eraser photo tools.',
    specs: JSON.stringify({ display: '6.3 inch OLED', processor: 'Google Tensor G2', battery: '4355 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '20W Wired' }),
    stock: 18, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-1.jpg',
    badge: 'Sale', rating: 4.5, review_count: 6710, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 7 Snow', brand: 'Google', model: 'Pixel 7',
    price: 399, original_price: 599, storage: '128GB', ram: '8GB', color: 'Snow',
    description: 'Crisp Snow white edition with fast wireless charging and 90Hz smooth display.',
    specs: JSON.stringify({ display: '6.3 inch OLED', processor: 'Google Tensor G2', battery: '4355 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '20W Wired' }),
    stock: 15, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-1.jpg',
    badge: 'Sale', rating: 4.5, review_count: 5120, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 6 Pro Stormy Black', brand: 'Google', model: 'Pixel 6 Pro',
    price: 349, original_price: 899, storage: '128GB', ram: '12GB', color: 'Stormy Black',
    description: 'Refurbished certified premier flagship. 120Hz curved display and 4x optical zoom.',
    specs: JSON.stringify({ display: '6.71 inch LTPO OLED', processor: 'Google Tensor', battery: '5003 mAh', camera: '50MP + 48MP + 12MP', os: 'Android 14', charging: '23W Wired' }),
    stock: 8, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-6-pro-1.jpg',
    badge: 'Sale', rating: 4.4, review_count: 9812, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 6 Kinda Coral', brand: 'Google', model: 'Pixel 6',
    price: 299, original_price: 599, storage: '128GB', ram: '8GB', color: 'Kinda Coral',
    description: 'Collector favorite two-tone Kinda Coral colorway with Google Tensor first-gen chip.',
    specs: JSON.stringify({ display: '6.4 inch OLED', processor: 'Google Tensor', battery: '4614 mAh', camera: '50MP + 12MP', os: 'Android 14', charging: '21W Wired' }),
    stock: 7, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-6-1.jpg',
    badge: 'Sale', rating: 4.4, review_count: 7640, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 6a Sage', brand: 'Google', model: 'Pixel 6a',
    price: 249, original_price: 449, storage: '128GB', ram: '6GB', color: 'Sage',
    description: 'Budget champion with Google Tensor chip, iconic camera visor, and all-day adaptive battery.',
    specs: JSON.stringify({ display: '6.1 inch OLED', processor: 'Google Tensor', battery: '4410 mAh', camera: '12.2MP + 12MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 12, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-6a-1.jpg',
    badge: 'Sale', rating: 4.5, review_count: 8940, featured: 0
  },
  {
    id: uuidv4(), name: 'Pixel 6a Charcoal', brand: 'Google', model: 'Pixel 6a',
    price: 249, original_price: 449, storage: '128GB', ram: '6GB', color: 'Charcoal',
    description: 'Incredible value entry point to the Google Pixel ecosystem with guaranteed security updates.',
    specs: JSON.stringify({ display: '6.1 inch OLED', processor: 'Google Tensor', battery: '4410 mAh', camera: '12.2MP + 12MP', os: 'Android 14', charging: '18W Wired' }),
    stock: 14, image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-6a-1.jpg',
    badge: 'Sale', rating: 4.5, review_count: 6780, featured: 0
  }
];

function seed() {
  db.exec('PRAGMA foreign_keys = OFF;');
  db.prepare('DELETE FROM reviews').run();
  db.prepare('DELETE FROM products').run();
  db.exec('PRAGMA foreign_keys = ON;');

  const insert = db.prepare(`
    INSERT INTO products
      (id, name, brand, model, price, original_price, storage, ram, color, description, specs, stock, image_url, badge, rating, review_count, featured)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    insert.run(
      p.id, p.name, p.brand, p.model, p.price, p.original_price,
      p.storage, p.ram, p.color, p.description, p.specs, p.stock,
      p.image_url, p.badge, p.rating, p.review_count, p.featured
    );
  }

  // Also seed high-quality customer reviews for all products
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, product_id, user_name, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const insertedProducts = db.prepare('SELECT id, name FROM products').all();
  for (const prod of insertedProducts) {
    insertReview.run(uuidv4(), prod.id, 'Verified Customer', 5, 'Outstanding hardware and incredible photography! Battery easily lasts over a full day.', '-2 days');
    insertReview.run(uuidv4(), prod.id, 'Pixel Fan', 5, 'Super smooth experience, bright display, and pristine build quality.', '-6 days');
  }

  console.log(`Successfully seeded ${products.length} Google Pixel devices into primphone.db!`);
}

if (require.main === module) {
  seed();
}

module.exports = { products, seed };
