import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const navigate = useNavigate()

  const handleCheckout = useCallback(() => {
    closeCart()
    navigate('/checkout')
  }, [closeCart, navigate])

  const fmt = (n: number) => `$${n.toFixed(2)}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with elegant blur */}
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-white border-l border-slate-200 shadow-[-12px_0_40px_rgba(0,0,0,0.08)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-slate-800">Your Cart</span>
                    {itemCount() > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                        {itemCount()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Premium Pixel Collection</p>
                </div>
              </div>
              <motion.button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
              {items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-4 text-center py-16"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <div className="max-w-xs">
                    <p className="font-heading text-xl font-semibold text-slate-700">Your cart is empty</p>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                      Explore our flagship Google Pixel devices and add your favorites to checkout.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => { closeCart(); navigate('/shop') }}
                    className="btn-primary px-7 py-3 rounded-full text-sm font-medium mt-2 shadow-md shadow-primary/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Explore Collection</span>
                  </motion.button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      className="bg-white rounded-2xl p-4 flex gap-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-primary/30 transition-all group"
                    >
                      {/* Product Mobile Image Container */}
                      <div 
                        onClick={() => {
                          closeCart()
                          navigate(`/products/${item.product.id}`)
                        }}
                        className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-1.5 flex items-center justify-center cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
                      >
                        <img 
                          src={item.product.image_url || 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg'} 
                          alt={item.product.name} 
                          className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                          onError={(e) => {
                            // Fallback to high-res Pixel 9 image if URL fails
                            (e.target as HTMLImageElement).src = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg'
                          }}
                        />
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 
                              onClick={() => {
                                closeCart()
                                navigate(`/products/${item.product.id}`)
                              }}
                              className="font-heading text-slate-800 font-semibold leading-snug truncate hover:text-primary transition-colors cursor-pointer text-base"
                            >
                              {item.product.name}
                            </h4>
                            <motion.button
                              onClick={() => removeItem(item.product.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                              whileTap={{ scale: 0.85 }}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <p className="text-slate-400 text-xs font-mono mt-0.5">
                            {item.product.storage || '256GB'} {item.product.color ? `· ${item.product.color}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          {/* Price */}
                          <span className="font-mono text-primary font-bold text-base">
                            {fmt(item.product.price)}
                          </span>

                          {/* Quantity selector */}
                          <div className="flex items-center bg-slate-100/80 rounded-lg p-0.5 border border-slate-200">
                            <motion.button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-primary hover:shadow-xs transition-all"
                              whileTap={{ scale: 0.8 }}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="font-mono text-xs font-semibold w-7 text-center text-slate-800">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-primary hover:shadow-xs transition-all"
                              whileTap={{ scale: 0.8 }}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-white space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-800 font-semibold">{fmt(total())}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Shipping</span>
                    <span className="font-mono text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      FREE EXPRESS
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex justify-between items-baseline">
                  <span className="font-heading text-slate-800 text-lg font-bold">Total</span>
                  <div className="text-right">
                    <span className="font-mono text-primary text-2xl font-bold tracking-tight">
                      {fmt(total())}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">Taxes included</p>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-4 rounded-full flex items-center justify-center gap-2 text-sm font-semibold tracking-wide shadow-lg shadow-primary/25"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit SSL encrypted & Authentic Guarantee</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
