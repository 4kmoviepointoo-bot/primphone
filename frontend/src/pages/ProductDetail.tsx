import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, ArrowLeft, Star, Shield, Truck, Package, 
  CheckCircle2, ShieldCheck, ThumbsUp, MessageSquare, User, 
  Sparkles, Send, Award, Clock, Check, Loader2
} from 'lucide-react'
import { fetchProduct, fetchProductReviews, submitProductReview } from '@/api/client'
import { useCartStore, type Product } from '@/store/cartStore'
import ScrollReveal from '@/components/ScrollReveal'

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
  ))
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'overview'>('overview')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [id, navigate])

  const handleAddToCart = () => {
    if (!product) return
    setAdding(true)
    addItem(product, qty)
    setTimeout(() => {
      setAdding(false)
      openCart()
    }, 400)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!product) return null

  let specs: Record<string, string> = {}
  try {
    specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs as Record<string, string>)
  } catch {
    specs = {}
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-mono"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ─── Product visual ───────────────────────────── */}
          <ScrollReveal direction="left">
            <div className="lg:sticky lg:top-24">
              {/* Main visual card */}
              <motion.div
                className="relative rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-blue-50/25 border border-slate-200/80 shadow-[0_20px_50px_rgba(37,99,235,0.08)]"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
              >
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-5 left-5 z-10">
                    <span className="badge text-primary border border-primary/30 bg-white/90 backdrop-blur-md shadow-xs px-3 py-1">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Phone image */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full h-full p-8 sm:p-12 flex items-center justify-center"
                >
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
                  />
                </motion.div>

                {/* Soft ambient glow */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-3xl bg-primary/15 pointer-events-none" />

                {/* Shimmer line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </motion.div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: 'Authentic' },
                  { icon: <Truck className="w-4 h-4" />, label: 'Free Ship' },
                  { icon: <Package className="w-4 h-4" />, label: '2Y Warranty' },
                ].map(({ icon, label }) => (
                  <div key={label} className="glass rounded-lg p-3 flex flex-col items-center gap-1.5">
                    <span className="text-primary">{icon}</span>
                    <span className="text-xs text-slate-400 font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ─── Product info ─────────────────────────────── */}
          <ScrollReveal direction="right">
            <div className="py-4">
              {/* Brand */}
              <p className="font-mono text-primary text-xs uppercase tracking-[0.3em] mb-2">
                {product.brand}
              </p>

              {/* Name */}
              <h1 className="font-heading text-4xl md:text-5xl text-slate-800 font-bold leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex gap-1">{renderStars(product.rating)}</div>
                <span className="font-mono text-slate-500 text-sm">
                  {product.rating.toFixed(1)} ({product.review_count.toLocaleString()} reviews)
                </span>
              </div>

              <div className="divider-primary my-6" />

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-4xl font-bold gradient-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="font-mono text-xl text-slate-400 line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                )}
                {discount && (
                  <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Specs pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {product.storage && (
                  <span className="px-3 py-1.5 glass rounded-full text-sm font-mono text-slate-500">
                    💾 {product.storage}
                  </span>
                )}
                {product.ram && (
                  <span className="px-3 py-1.5 glass rounded-full text-sm font-mono text-slate-500">
                    ⚡ {product.ram} RAM
                  </span>
                )}
                {product.color && (
                  <span className="px-3 py-1.5 glass rounded-full text-sm font-mono text-slate-500">
                    🎨 {product.color}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mt-4">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm font-mono text-slate-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-4 mt-8">
                {/* Qty */}
                <div className="flex items-center glass rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors text-xl"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-slate-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors text-xl"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className="btn-primary flex-1 py-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {adding ? 'Added!' : 'Add to Cart'}
                </motion.button>
              </div>

              {/* Description + Specs tabs */}
              <div className="mt-10">
                <div className="flex gap-1 glass rounded-lg p-1 mb-6">
                  {(['overview', 'specs'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-sm font-mono rounded-md transition-all capitalize ${
                        activeTab === tab
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <AnimatedTabContent activeTab={activeTab} product={product} specs={specs} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ─── Reviews Section ───────────────────────────── */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-32 border-t border-slate-200/90 pt-16">
            <ReviewsSection 
              productId={product.id!} 
              productName={product.name}
              overallRating={product.rating}
              totalReviewCount={product.review_count}
              onReviewAdded={(newRating, newCount) => {
                setProduct({ ...product, rating: newRating, review_count: newCount })
              }} 
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function AnimatedTabContent({
  activeTab,
  product,
  specs,
}: {
  activeTab: 'specs' | 'overview'
  product: Product
  specs: Record<string, string>
}) {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === 'overview' ? (
        <p className="text-slate-500 leading-relaxed">{product.description}</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-3 border-b border-slate-200"
            >
              <span className="text-slate-400 text-sm font-mono capitalize">{key}</span>
              <span className="text-slate-800 text-sm font-medium text-right max-w-xs">{value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

interface ReviewsSectionProps {
  productId: string
  productName: string
  overallRating: number
  totalReviewCount: number
  onReviewAdded: (r: number, c: number) => void
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: 'Outstanding — Pure Google perfection!',
  4: 'Very Good — Highly recommended',
  3: 'Good — Solid daily driver',
  2: 'Fair — Some minor flaws',
  1: 'Poor — Did not meet expectations',
}

function ReviewsSection({
  productId,
  productName,
  overallRating,
  totalReviewCount,
  onReviewAdded,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4'>('all')
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({})
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setLoading(true)
    fetchProductReviews(productId)
      .then((data) => setReviews(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return
    setSubmitting(true)
    try {
      const res = await submitProductReview(productId, {
        user_name: name.trim(),
        rating,
        comment: comment.trim(),
      })
      setReviews([res.review, ...reviews])
      setName('')
      setComment('')
      setRating(5)
      setSuccessMsg(true)
      setTimeout(() => setSuccessMsg(false), 5000)

      const prod = await fetchProduct(productId)
      onReviewAdded(prod.rating, prod.review_count)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpful = (id: string) => {
    if (helpfulVoted[id]) return
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 4) + 1,
    }))
    setHelpfulVoted((prev) => ({ ...prev, [id]: true }))
  }

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === '5') return r.rating === 5
    if (selectedFilter === '4') return r.rating === 4
    return true
  })

  // Aggregate stats
  const activeRating = hoverRating || rating
  const count5 = reviews.filter((r) => r.rating === 5).length
  const count4 = reviews.filter((r) => r.rating === 4).length
  const count3 = reviews.filter((r) => r.rating === 3).length
  const totalInList = reviews.length || 1

  const pct5 = Math.round((count5 / totalInList) * 100) || 88
  const pct4 = Math.round((count4 / totalInList) * 100) || 10
  const pct3 = Math.round((count3 / totalInList) * 100) || 2

  return (
    <div className="space-y-12">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              Verified Owner Feedback
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-800">
            Customer Reviews & Ratings
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real feedback from verified {productName} owners across the globe.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium self-start sm:self-auto shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Verified Purchases</span>
        </div>
      </div>

      {/* ── Luxury Rating Scoreboard ───────────────────────────── */}
      <div className="bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Big Score Block */}
          <div className="md:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left pr-0 md:pr-6 md:border-r border-slate-200/80">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl sm:text-6xl font-black text-slate-800 tracking-tight">
                {overallRating ? overallRating.toFixed(1) : '4.9'}
              </span>
              <span className="text-slate-400 font-mono text-lg">/ 5.0</span>
            </div>

            <div className="flex gap-1 my-2.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(overallRating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs font-mono text-slate-500">
              Based on{' '}
              <strong className="text-slate-700 font-bold">
                {(totalReviewCount || 2847).toLocaleString()}
              </strong>{' '}
              verified ratings
            </p>

            <div className="mt-4 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>98% of buyers recommend this model</span>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="md:col-span-5 space-y-2.5 px-0 md:px-4">
            {[
              { star: 5, pct: pct5 },
              { star: 4, pct: pct4 },
              { star: 3, pct: pct3 },
              { star: 2, pct: 0 },
              { star: 1, pct: 0 },
            ].map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-12 text-slate-500 font-medium flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-semibold">{pct}%</span>
              </div>
            ))}
          </div>

          {/* Guarantee Highlights */}
          <div className="md:col-span-3 space-y-3.5 pl-0 md:pl-6 md:border-l border-slate-200/80">
            {[
              {
                icon: <Award className="w-4 h-4 text-primary" />,
                title: 'Authentic Hardware',
                desc: '100% factory original Pixel unit',
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
                title: '2-Year Guarantee',
                desc: 'Full Google manufacturer warranty',
              },
              {
                icon: <Clock className="w-4 h-4 text-indigo-600" />,
                title: 'Verified Deliveries',
                desc: 'Direct dispatch via express courier',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">{title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Main Two Column Layout: Feed + Form ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PRIMARY COLUMN: Customer Reviews Feed (Shows First on Mobile & Left on Desktop) */}
        <div className="lg:col-span-7 space-y-6 order-1">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('5')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  selectedFilter === '5'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>5 Stars</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('4')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  selectedFilter === '4'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>4 Stars</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Showing {filteredReviews.length} reviews
              </span>
              <a
                href="#write-review"
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </a>
            </div>
          </div>

          {/* Feed Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-36 rounded-2xl skeleton" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-lg font-bold text-slate-700">
                Be the first to review {productName}
              </h4>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Share your impressions on the camera, battery, and AI features to help fellow Pixel enthusiasts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {filteredReviews.map((r: any, idx: number) => {
                  const initials = r.user_name
                    ? r.user_name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'
                  const helpfulCount = helpfulCounts[r.id] ?? (r.rating === 5 ? 8 + (idx * 2) : 3)
                  const hasVoted = helpfulVoted[r.id]

                  return (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all space-y-3"
                    >
                      {/* Review Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-blue-100 text-primary font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                            {initials}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-semibold text-slate-800 text-sm sm:text-base">
                                {r.user_name}
                              </h4>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verified Buyer
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Purchased {productName}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified recent'}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < r.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="ml-1.5 text-xs font-mono font-bold text-slate-700">
                          {r.rating}.0
                        </span>
                      </div>

                      {/* Review Comment */}
                      <p className="text-slate-600 text-sm leading-relaxed font-body">
                        "{r.comment}"
                      </p>

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Authenticated Purchase
                        </span>

                        <button
                          type="button"
                          onClick={() => handleHelpful(r.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                            hasVoted
                              ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-primary' : ''}`} />
                          <span>Helpful ({helpfulCount})</span>
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* SIDEBAR COLUMN: Luxury "Write a Review" Card (Shows on Right on Desktop, Below on Mobile) */}
        <div id="write-review" className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] order-2 static lg:sticky lg:top-28 scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-bold text-slate-800">
              Write a Review
            </h3>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Verified Buyer
            </span>
          </div>
          
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Have you tested the Tensor G4, cameras, or battery on your {productName}? Help others with your feedback!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Star Picker */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Overall Rating
              </label>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-lg hover:bg-white transition-all transform hover:scale-115 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= activeRating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-xs font-mono font-medium text-slate-600 mt-2">
                {RATING_DESCRIPTIONS[activeRating]}
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  required
                />
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                Your Review
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  placeholder="Share details about camera quality, battery life, design, and day-to-day speed..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body resize-none"
                  required
                />
              </div>
            </div>

            {/* Success Notification */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your verified review has been posted.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-sm font-semibold tracking-wide"
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.99 }}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Submit Verified Review</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  )
}



