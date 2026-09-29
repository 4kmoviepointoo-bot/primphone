import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { fetchProducts, adminFetchAllOrders } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { type Product } from '@/store/cartStore'

interface Order {
  id: string
  status: string
  total: number
  created_at: string
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    Promise.all([fetchProducts(), adminFetchAllOrders()])
      .then(([prods, ords]) => { setProducts(prods); setOrders(ords) })
      .catch(console.error)
  }, [user, navigate])

  const totalRevenue = orders.reduce((s: number, o: Order) => s + o.total, 0)
  const delivered = orders.filter((o: Order) => o.status === 'delivered').length

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-primary' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Products', value: products.length, icon: <Package className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Delivered', value: delivered, icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 bg-primary/40" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="font-heading text-4xl text-slate-800">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-primary rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`${s.color} mb-3`}>{s.icon}</div>
              <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-sm font-mono mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Admin nav */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            onClick={() => navigate('/admin/products')}
            className="glass-primary rounded-xl p-6 text-left hover:border-primary/30 border border-transparent transition-all"
            whileHover={{ y: -4 }}
          >
            <Package className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-heading text-xl text-slate-800">Manage Products</h3>
            <p className="text-slate-400 text-sm mt-1">{products.length} products in catalog</p>
          </motion.button>

          <motion.button
            onClick={() => navigate('/admin/orders')}
            className="glass-primary rounded-xl p-6 text-left hover:border-primary/30 border border-transparent transition-all"
            whileHover={{ y: -4 }}
          >
            <Users className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-heading text-xl text-slate-800">Manage Orders</h3>
            <p className="text-slate-400 text-sm mt-1">{orders.length} total orders</p>
          </motion.button>
        </div>

        {/* Recent orders */}
        <div className="mt-10">
          <h2 className="font-heading text-2xl text-slate-800 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, i) => (
              <motion.div
                key={order.id}
                className="glass rounded-xl p-4 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="font-mono text-sm text-slate-500">{order.id.slice(0, 8).toUpperCase()}</span>
                <span className={`text-sm font-mono capitalize ${
                  order.status === 'delivered' ? 'text-green-400' :
                  order.status === 'shipped' ? 'text-blue-400' :
                  order.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {order.status}
                </span>
                <span className="font-mono text-primary">${order.total.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


