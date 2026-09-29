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

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="badge text-primary bg-white border border-primary/30"
              style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount tag */}
        {discount && (
          <div className="absolute top-4 right-4 z-10">
            <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">
              -{discount}%
            </span>
          </div>
        )}

        {/* Phone image area */}
        <div className="relative h-64 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          {/* Glow blob */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2), transparent 70%)' }}
            />
          </motion.div>

          {/* 3D Phone Image */}
          <motion.div
            className="relative z-10 w-full h-full p-6 flex items-center justify-center"
            animate={{
              y: isHovered ? -8 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-full h-full flex items-center justify-center bg-white rounded-xl p-2 overflow-hidden shadow-[0_10px_40px_rgba(37,99,235,0.15)] ring-1 ring-slate-200">
               <img 
                 src={product.image_url} 
                 alt={product.name} 
                 className="w-full h-full object-contain mix-blend-multiply"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
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
          <div className="flex gap-2 mt-2 flex-wrap">
            {product.storage && (
              <span className="text-xs text-slate-500 bg-white-3 px-2 py-0.5 rounded-sm font-mono">
                {product.storage}
              </span>
            )}
            {product.ram && (
              <span className="text-xs text-slate-500 bg-white-3 px-2 py-0.5 rounded-sm font-mono">
                {product.ram} RAM
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-xs text-slate-400 font-mono">
              {product.rating} ({product.review_count.toLocaleString()})
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold gradient-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="font-mono text-sm text-slate-400 line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Free shipping</p>
            </div>

            <motion.button
              onClick={handleAddToCart}
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




