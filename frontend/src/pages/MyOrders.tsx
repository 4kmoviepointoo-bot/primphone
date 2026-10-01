import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { fetchMyOrders } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import ScrollReveal from '@/components/ScrollReveal'

interface Order {
  id: string
  status: string
  total: number
  created_at: string
  items: string | { product_id: string; quantity: number; price: number }[]
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  processing: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400', label: 'Processing' },
  shipped: { icon: <Truck className="w-4 h-4" />, color: 'text-blue-400', label: 'Shipped' },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400', label: 'Delivered' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', label: 'Cancelled' },
}

export default function MyOrders() {
  const { user, openAuthModal } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      openAuthModal('login')
      navigate('/')
      return
    }
    fetchMyOrders()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.orders || [])
        setOrders(list)
      })
      .catch((err) => {
        console.error(err)
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [user, openAuthModal, navigate])

  const orderList = Array.isArray(orders) ? orders : []

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-primary/40" />
              <span className="font-mono text-primary text-xs uppercase tracking-widest">Account</span>
            </div>
            <h1 className="font-heading text-4xl text-slate-800">My Orders</h1>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl skeleton" />)}
          </div>
        ) : orderList.length === 0 ? (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="font-heading text-2xl text-slate-800/50">No orders yet</p>
            <p className="text-slate-400 text-sm mt-2">Your premium devices will appear here</p>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary px-8 py-3 rounded-sm text-sm mt-6 inline-flex items-center gap-2"
            >
              Shop Now
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orderList.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.processing
              let parsedItems: { quantity: number; price: number }[] = []
              try {
                parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
              } catch { /* empty */ }

              return (
                <motion.div
                  key={order.id}
                  className="glass-primary rounded-xl p-5 hover:border-primary/20 border border-transparent transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-mono text-xs text-slate-400 mb-1">Order ID</p>
                      <p className="font-mono text-slate-800 font-medium">{order.id.slice(0, 8).toUpperCase()}…</p>
                    </div>
                    <div className={`flex items-center gap-2 ${status.color}`}>
                      {status.icon}
                      <span className="text-sm font-mono">{status.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-slate-400 mb-1">Total</p>
                      <p className="font-mono text-primary font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-slate-400 mb-1">Date</p>
                      <p className="font-mono text-slate-800 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {parsedItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-slate-400 text-xs font-mono">
                        {parsedItems.reduce((s, i) => s + i.quantity, 0)} item{parsedItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


