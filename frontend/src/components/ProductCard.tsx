import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore, type Product } from '@/store/cartStore'

interface Props {
  product: Product
  index?: number
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${i < Math.round(rating) ? 'star-filled fill-primary' : 'star-empty'}`}
    />
  ))
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem, openCart } = useCartStore()
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [addedFlash, setAddedFlash] = useState(false)

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 12, y: -x * 12 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      addItem(product)
      openCart()
      setAddedFlash(true)
      setTimeout(() => setAddedFlash(false), 600)
    },
    [addItem, openCart, product]
  )

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  return (
    <motion.div
      ref={cardRef}
      className="product-3d-container cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.05s linear' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-card hover:shadow-card-hover transition-shadow duration-500">

        {/* Phone image area */}
        <div className="relative h-64 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white/60">
          {/* Glow blob */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18), transparent 70%)' }}
            />
          </motion.div>

          {/* 3D Phone Image with top clearance */}
          <motion.div
            className="relative z-10 w-full h-full pt-8 pb-3 px-6 flex items-center justify-center"
            animate={{
              y: isHovered ? -8 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img 
              src={product.image_url} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-transform duration-300"
            />
          </motion.div>

          {/* Floating Badges Layer - Guaranteed above image via z-30 & translateZ */}
          <div 
            className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between pointer-events-none"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div>
              {Boolean(product.badge && product.badge.trim()) && (
                <span
                  className="badge text-primary bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-full shadow-sm font-semibold pointer-events-auto"
                  style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}
                >
                  {product.badge.trim()}
                </span>
              )}
            </div>

            <div>
              {Boolean(discount) && (
                <span className="badge bg-rose-50/95 text-rose-600 border border-rose-200/90 px-2.5 py-1 rounded-full shadow-sm font-bold pointer-events-auto text-xs">
                  -{discount}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Brand */}
          <p className="font-mono text-slate-400 text-xs uppercase tracking-widest mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-heading text-slate-800 text-lg leading-tight group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Specs row */}
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {product.storage && (
              <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-mono font-medium">
                {product.storage}
              </span>
            )}
            {product.ram && (
              <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-mono font-medium">
                {product.ram} RAM
              </span>
            )}
          </div>

          {/* Rating - Increased spacing to distinguish from specs */}
          <div className="flex items-center gap-2 mt-4 pt-0.5">
            <div className="flex gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-xs text-slate-400 font-mono">
              {product.rating} ({product.review_count.toLocaleString()})
            </span>
          </div>

          {/* Price + CTA - Anchored together across horizontal space */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold gradient-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="font-mono text-xs text-slate-400 line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Free express shipping</p>
            </div>

            <motion.button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="relative w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: addedFlash
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #2563EB, #60A5FA)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <motion.div
                animate={{ rotate: addedFlash ? 360 : 0 }}
                transition={{ duration: 0.4 }}
              >
                {addedFlash ? (
                  <Zap className="w-5 h-5 text-white" />
                ) : (
                  <ShoppingCart className="w-4 h-4 text-white" />
                )}
              </motion.div>

              {/* Ripple */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: addedFlash ? 2 : 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Bottom shine line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, #2563EB, transparent)' }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  )
}




