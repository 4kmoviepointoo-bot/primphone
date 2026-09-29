import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import { fetchOrder } from '@/api/client'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState<{ id: string; status: string; total: number; created_at: string } | null>(null)

  useEffect(() => {
    if (!id) return
    fetchOrder(id)
      .then(setOrder)
      .catch(console.error)
  }, [id])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      {/* Background orbs */}
      <div className="fixed top-1/3 left-1/3 w-96 h-96 orb orb-primary opacity-20" />
      <div className="fixed bottom-1/3 right-1/3 w-64 h-64 orb orb-purple opacity-15" />

      <motion.div
        className="relative z-10 text-center max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Check animation */}
        <motion.div
          className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-8"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2), rgba(8,8,16,0.8))' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          >
            <CheckCircle className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Confetti dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#C9A84C' : i % 3 === 1 ? '#7B5CF0' : '#00D4FF',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            initial={{ scale: 0, y: 0, opacity: 1 }}
            animate={{ scale: [0, 1, 0], y: -100, opacity: [1, 1, 0] }}
            transition={{ delay: 0.3 + i * 0.05, duration: 1.2, ease: 'easeOut' }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-display text-5xl font-light text-slate-800 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 text-lg mb-8">
            Your premium device is on its way. Thank you for choosing PrimePhone.
          </p>

          {order && (
            <motion.div
              className="glass-primary rounded-xl p-6 mb-8 text-left space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-heading text-slate-800">Order Details</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-mono">Order ID</span>
                <span className="font-mono text-slate-800 text-xs">{order.id.slice(0, 8).toUpperCase()}…</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-mono">Status</span>
                <span className="font-mono text-yellow-400 capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-mono">Total Paid</span>
                <span className="font-mono text-primary font-bold">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-mono">Placed</span>
                <span className="font-mono text-slate-800 text-xs">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <motion.button
                className="btn-primary px-8 py-4 rounded-sm text-sm flex items-center gap-2 w-full sm:w-auto"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Package className="w-4 h-4" />
                Track Order
              </motion.button>
            </Link>
            <Link to="/">
              <motion.button
                className="btn-outline-primary px-8 py-4 rounded-sm text-sm flex items-center gap-2 w-full sm:w-auto"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </span>
              </motion.button>
            </Link>
          </div>

          <Link to="/shop" className="block mt-6">
            <span className="text-slate-500 text-sm hover:text-primary transition-colors flex items-center justify-center gap-1 animated-underline">
              Continue Shopping <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}


