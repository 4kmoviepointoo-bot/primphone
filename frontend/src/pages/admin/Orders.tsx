import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Loader2 } from 'lucide-react'
import { adminFetchAllOrders, adminUpdateOrderStatus } from '@/api/client'
import { useAuthStore } from '@/store/authStore'

interface Order {
  id: string
  user_id: string
  status: string
  total: number
  created_at: string
  items: string
  shipping_address: string
}

const statusColors: Record<string, string> = {
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
}

const allStatuses = ['processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    adminFetchAllOrders()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.orders || [])
        setOrders(list)
      })
      .catch((err) => {
        console.error(err)
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [user, navigate])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    setOpenDropdown(null)
    try {
      await adminUpdateOrderStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-6 bg-primary/40" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="font-heading text-3xl text-slate-800">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => {
              let address: Record<string, string> = {}
              try { address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address }
              catch { /* empty */ }

              let items: { product_id: string; quantity: number; price: number }[] = []
              try { items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items }
              catch { /* empty */ }

              return (
                <motion.div
                  key={order.id}
                  className="glass-primary rounded-xl p-5"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-400 mb-0.5">Order</p>
                      <p className="font-mono text-slate-800 font-medium text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                      {address.fullName && (
                        <p className="text-slate-400 text-xs mt-0.5">{address.fullName} · {address.city}, {address.country}</p>
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-xs text-slate-400 mb-0.5">Items</p>
                      <p className="font-mono text-slate-800 text-sm">
                        {items.reduce((s, it) => s + it.quantity, 0)} item(s)
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-xs text-slate-400 mb-0.5">Total</p>
                      <p className="font-mono text-primary font-bold">${order.total.toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="font-mono text-xs text-slate-400 mb-0.5">Date</p>
                      <p className="font-mono text-slate-800 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Status dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                        disabled={updatingId === order.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-mono transition-all ${statusColors[order.status] || 'text-slate-400 border-muted/20'}`}
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span className="capitalize">{order.status}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === order.id ? 'rotate-180' : ''}`} />
                          </>
                        )}
                      </button>
                      {openDropdown === order.id && (
                        <motion.div
                          className="absolute right-0 top-full mt-1 w-36 glass-primary rounded-lg py-1 z-20 border border-primary/10"
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        >
                          {allStatuses.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              className={`w-full text-left px-4 py-2 text-sm font-mono capitalize transition-colors ${
                                order.status === s ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


