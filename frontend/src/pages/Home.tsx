import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Shield, Truck, Headphones, ChevronDown, Sparkles } from 'lucide-react'
import { fetchProducts } from '@/api/client'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedText from '@/components/AnimatedText'
import HeroLiveWallpaper from '@/components/HeroLiveWallpaper'
import { type Product } from '@/store/cartStore'

const brands = ['GOOGLE', 'PIXEL', 'TENSOR', 'ANDROID', 'AI']

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Authentic Guarantee',
    desc: 'Every device is certified genuine, sealed in original packaging.',
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'Free Express Delivery',
    desc: 'Complimentary overnight shipping on all orders over $500.',
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: '24/7 Concierge',
    desc: 'Dedicated premium support for every customer, around the clock.',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: '2-Year Warranty',
    desc: 'Extended coverage and priority service for total peace of mind.',
  },
]

const initialFeaturedProducts: Product[] = [
  {
    id: '544782ce-8bd2-4c85-8e3a-4817b9d58169',
    name: 'Pixel 9 Pro',
    brand: 'Google',
    model: 'Pixel 9 Pro',
    price: 1199,
    storage: '256GB',
    ram: '12GB',
    color: 'Obsidian',
    description: 'The most pro Pixel ever. With the best camera system in a Pixel phone, all-new Pixel Camera features, Gemini AI on device, and long-lasting battery.',
    specs: { display: '6.3 inch LTPO OLED', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 48MP + 48MP' },
    stock: 10,
    image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    badge: 'New',
    rating: 4.9,
    review_count: 2847,
    featured: 1,
  },
  {
    id: '645a4d3f-4234-4b26-8616-c667bdd2a16a',
    name: 'Pixel 9 Pro XL',
    brand: 'Google',
    model: 'Pixel 9 Pro XL',
    price: 1299,
    storage: '256GB',
    ram: '16GB',
    color: 'Porcelain',
    description: 'The biggest, most powerful Pixel. Expansive display, massive battery, and the complete pro camera suite.',
    specs: { display: '6.8 inch LTPO OLED', processor: 'Google Tensor G4', battery: '5060 mAh', camera: '50MP + 48MP + 48MP' },
    stock: 10,
    image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
    badge: 'New',
    rating: 4.9,
    review_count: 1923,
    featured: 1,
  },
  {
    id: 'c646906c-5bf2-4a57-9d24-4a3c4e93b1d7',
    name: 'Pixel 9',
    brand: 'Google',
    model: 'Pixel 9',
    price: 999,
    storage: '128GB',
    ram: '12GB',
    color: 'Wintergreen',
    description: 'Meet Pixel 9. A fresh new look with Gemini AI built in, powerful camera, and all-day battery life.',
    specs: { display: '6.3 inch OLED', processor: 'Google Tensor G4', battery: '4700 mAh', camera: '50MP + 10.5MP' },
    stock: 10,
    image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
    badge: 'New',
    rating: 4.8,
    review_count: 3241,
    featured: 1,
  },
  {
    id: 'b3239202-7731-4d60-b584-17946fc731be',
    name: 'Pixel Fold 2',
    brand: 'Google',
    model: 'Pixel Fold 2',
    price: 1799,
    storage: '256GB',
    ram: '16GB',
    color: 'Obsidian',
    description: 'Unfold your world. The ultimate foldable phone with a seamless hinge, outer and inner displays, and pro-grade cameras.',
    specs: { display: '8.0 inch inner + 6.3 inch outer OLED', processor: 'Google Tensor G3', battery: '4650 mAh', camera: '48MP + 10.8MP + 10.8MP' },
    stock: 10,
    image_url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
    badge: 'Foldable',
    rating: 4.8,
    review_count: 987,
    featured: 1,
  },
]

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>(initialFeaturedProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.88, 1], [1, 1, 0])
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts({ featured: true })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(data.slice(0, 4))
        }
      })
      .catch((err) => {
        console.warn('Backend products fetch fallback:', err)
        setError(err.message || 'Failed to load products')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Google Pixel Inspired Live Animated Wallpaper */}
        <HeroLiveWallpaper />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 pointer-events-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Text, CTAs, Stats */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Eyebrow */}
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs mb-6 self-center lg:self-start pointer-events-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-slate-900 text-xs font-semibold tracking-wider">
                  Google Tensor G4 • Official Store
                </span>
              </motion.div>

              {/* Main headline with unified font family and subtle halo */}
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight mb-6 drop-shadow-[0_2px_12px_rgba(255,255,255,0.85)]">
                <span className="block text-slate-950 font-medium">Beyond</span>
                <span className="block text-[#1E3A8A] italic font-display font-semibold">Ordinary.</span>
              </h1>

              {/* Subheadline with high-contrast text and subtle frosted plate */}
              <motion.div
                className="bg-white/45 backdrop-blur-[4px] p-4 rounded-2xl border border-white/60 shadow-xs max-w-xl mx-auto lg:mx-0 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <p className="font-body text-base sm:text-lg md:text-xl text-slate-900 font-medium leading-relaxed">
                  Discover the world's most intelligent smartphones. 
                  Curated Google Pixel collection — where on-device Gemini AI meets luxury design.
                </p>
              </motion.div>

              {/* CTAs - Harmonized in height, padding, and iconography */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pointer-events-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={() => navigate('/shop')}
                  className="btn-primary w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-primary/30"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/shop?featured=true')}
                  className="group w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2.5 bg-white text-slate-900 hover:text-primary border border-slate-300 shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>View Featured</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              </motion.div>

              {/* Stats in frosted capsule */}
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 mt-10 sm:mt-14 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-xs w-fit mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                {[
                  { value: '10+', label: 'Flagship Models' },
                  { value: '4.8★', label: 'Average Rating' },
                  { value: '20K+', label: 'Verified Buyers' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <p className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-950">{value}</p>
                    <p className="text-slate-700 text-xs font-mono uppercase tracking-wider font-semibold mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: 3D Hero Phone Showcase anchored to content rhythm */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end pointer-events-auto mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -12, 0], rotateY: [3, -3, 3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                >
                  <HeroPhone />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── BRAND TICKER ─────────────────────────────────────────────── */}
      <div className="border-y border-slate-200 bg-[#F1F5F9] py-5 overflow-hidden">
        <motion.div
          className="flex gap-20 items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="font-mono text-sm uppercase tracking-[0.3em] text-slate-400/40 flex items-center gap-4">
              <span className="w-1 h-1 rounded-full bg-primary/30 inline-block" />
              {b}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-[#FFFFFF]">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary/40" />
              <span className="font-mono text-primary text-xs uppercase tracking-[0.3em]">
                Featured
              </span>
              <div className="h-px w-8 bg-primary/40" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-slate-800">
              Flagship Collection
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">
              Our most coveted Pixel devices, curated for those who demand excellence.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featured.length > 0 ? featured : initialFeaturedProducts).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <ScrollReveal direction="up" delay={0.3}>
          <div className="text-center mt-12">
            <Link to="/shop">
              <motion.button
                className="btn-primary px-9 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2.5 shadow-lg shadow-primary/25"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── FEATURES STRIP ───────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-[#F8FAFC] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.1}>
                <div className="flex flex-col items-start gap-4 p-6 glass rounded-xl hover:border-primary/20 border border-transparent transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-slate-800 font-semibold">{f.title}</h3>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PIXEL 9 PRO SPOTLIGHT ────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-[#F5F5F4]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb orb-primary opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <span className="badge bg-primary/10 text-primary border border-primary/20 mb-4 inline-block">
                  NEW ARRIVAL
                </span>
                <h2 className="font-display text-5xl md:text-6xl font-light text-slate-800 leading-tight">
                  Pixel 9 Pro XL
                  <br />
                  <span className="italic gradient-primary">Redefines</span>
                  <br />
                  Intelligence.
                </h2>
                <p className="text-slate-500 mt-6 leading-relaxed max-w-md">
                  Google's most advanced AI chip, Tensor G4, paired with a pro-grade
                  triple camera system. Every photo, every interaction — reimagined.
                </p>

                {/* Pure typographic spec highlights without button-like containers */}
                <div className="grid grid-cols-3 gap-6 mt-10">
                  {[
                    { v: '50MP', l: 'Main Camera' },
                    { v: 'G4', l: 'Tensor Chip' },
                    { v: '24hr', l: 'Battery Life' },
                  ].map(({ v, l }) => (
                    <div key={l} className="border-l-2 border-primary/40 pl-3.5 py-1">
                      <p className="font-mono text-2xl font-bold text-slate-900">{v}</p>
                      <p className="text-slate-500 text-xs mt-0.5 font-medium">{l}</p>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={() => navigate('/shop?series=Pixel 9')}
                  className="btn-primary mt-10 px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2.5 w-fit shadow-xl shadow-primary/25"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Shop Pixel 9 Pro XL — $1,299</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0, -2, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full blur-3xl bg-primary/10 scale-150" />
                  <SpotlightPhone />
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAFAF9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl text-slate-800">
                What Our Customers Say
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} direction="up" delay={i * 0.15}>
                <div className="glass-primary rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200 mt-auto">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-mono font-bold text-sm">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-800 text-sm font-medium">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.title}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-[#FFFFFF]">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(123,92,240,0.05) 100%)',
          }}
        />
        <div className="absolute inset-0 border-y border-primary/10" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-5xl md:text-6xl font-light text-slate-800 mb-6">
              Ready to Upgrade?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Browse our full collection of premium Pixel devices.
            </p>
            <motion.button
              onClick={() => navigate('/shop')}
              className="btn-primary px-12 py-5 rounded-full text-base flex items-center gap-3 mx-auto shadow-xl shadow-primary/25"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Shop the Collection
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

const testimonials = [
  {
    name: 'Sarah M.',
    title: 'Tech Enthusiast',
    text: 'PrimePhone delivered my Pixel 9 Pro in pristine condition. The unboxing experience was as premium as the phone itself. Will definitely shop here again.',
  },
  {
    name: 'James K.',
    title: 'Photographer',
    text: 'The camera on my new Pixel 8 Pro blows everything out of the water. PrimePhone\'s service was exceptional — fast shipping and genuine product.',
  },
  {
    name: 'Amira L.',
    title: 'Business Executive',
    text: 'Finally a phone store that matches the premium feel of the devices they sell. The Pixel Fold 2 is incredible and arrived faster than expected.',
  },
]

function HeroPhone() {
  const navigate = useNavigate()
  return (
    <div 
      onClick={() => navigate('/shop?series=Pixel 9')}
      className="relative w-64 h-96 sm:w-72 sm:h-[420px] flex items-center justify-center bg-white/90 backdrop-blur-xl rounded-3xl p-5 overflow-hidden shadow-[0_25px_60px_rgba(37,99,235,0.18)] border border-slate-200/90 group cursor-pointer transition-all duration-300 hover:shadow-[0_30px_70px_rgba(37,99,235,0.25)]"
    >
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">Pixel 9 Pro XL</span>
      </div>
      <img
        src="https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg"
        alt="Pixel 9 Pro XL"
        width="288"
        height="420"
        loading="eager"
        decoding="async"
        className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-phone.png' }}
      />
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/95 backdrop-blur-md border border-slate-200/80 shadow-xs">
        <div>
          <p className="text-xs text-slate-500 font-mono font-medium">Tensor G4 • Gemini AI</p>
          <p className="text-sm font-bold text-slate-900 font-mono">$1,299</p>
        </div>
        <span className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold group-hover:bg-primary-dark transition-colors shadow-xs">
          Explore
        </span>
      </div>
    </div>
  )
}

function SpotlightPhone() {
  const navigate = useNavigate()
  return (
    <div 
      onClick={() => navigate('/shop?series=Pixel 9')}
      className="relative w-72 sm:w-80 h-[480px] flex items-center justify-center bg-white rounded-3xl p-6 overflow-hidden shadow-[0_30px_60px_rgba(37,99,235,0.18)] border border-slate-200/80 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
    >
      <img 
        src="https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg" 
        alt="Pixel 9 Pro XL"
        width="320"
        height="480"
        loading="lazy"
        decoding="async" 
        className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
    </div>
  )
}



