import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { type Product } from '@/store/cartStore'

const emptyForm = {
  name: '', brand: 'Google', model: '', price: '', original_price: '',
  storage: '128GB', ram: '8GB', color: '', description: '', badge: '',
  stock: '10', rating: '4.5', review_count: '0', featured: '0',
  display: '', processor: '', battery: '', camera: '', os: 'Android 15', charging: '',
}

export default function AdminProducts() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    load()
  }, [user, navigate])

  const load = () => {
    setLoading(true)
    fetchProducts().then(setProducts).finally(() => setLoading(false))
  }

  const openCreate = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    let specs: Record<string, string> = {}
    try { specs = typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs as Record<string, string>) }
    catch { /* empty */ }
    setForm({
      name: p.name, brand: p.brand, model: p.model || '', price: String(p.price),
      original_price: String(p.original_price || ''), storage: p.storage || '128GB',
      ram: p.ram || '8GB', color: p.color || '', description: p.description || '',
      badge: p.badge || '', stock: String(p.stock), rating: String(p.rating),
      review_count: String(p.review_count), featured: String(p.featured),
      display: specs.display || '', processor: specs.processor || '',
      battery: specs.battery || '', camera: specs.camera || '',
      os: specs.os || 'Android 15', charging: specs.charging || '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = new FormData()
      const specs = JSON.stringify({ display: form.display, processor: form.processor, battery: form.battery, camera: form.camera, os: form.os, charging: form.charging })
      ;(['name', 'brand', 'model', 'price', 'original_price', 'storage', 'ram', 'color', 'description', 'badge', 'stock', 'rating', 'review_count', 'featured'] as const).forEach(k => data.append(k, form[k]))
      data.append('specs', specs)
      if (editProduct) { await adminUpdateProduct(editProduct.id, data) }
      else { await adminCreateProduct(data) }
      setModalOpen(false)
      load()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try { await adminDeleteProduct(id); load() }
    catch (e) { console.error(e) }
    finally { setDeletingId(null) }
  }

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-6 bg-primary/40" />
              <span className="font-mono text-primary text-xs uppercase tracking-widest">Admin</span>
            </div>
            <h1 className="font-heading text-3xl text-slate-800">Products</h1>
          </div>
          <motion.button
            onClick={openCreate}
            className="btn-primary px-5 py-3 rounded-sm text-sm flex items-center gap-2"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 skeleton rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                className="glass-primary rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-heading text-slate-800 font-medium">{p.name}</p>
                    <p className="font-mono text-primary text-sm">${p.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openEdit(p)}
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </motion.button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-500 bg-white-3 px-2 py-0.5 rounded-sm">{p.storage}</span>
                  <span className="text-xs font-mono text-slate-500 bg-white-3 px-2 py-0.5 rounded-sm">Stock: {p.stock}</span>
                  {p.badge && <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{p.badge}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="glass-primary rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-slate-800">{editProduct ? 'Edit Product' : 'New Product'}</h2>
                  <motion.button onClick={() => setModalOpen(false)} className="w-8 h-8 glass rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800" whileHover={{ scale: 1.1 }}>
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { k: 'name', l: 'Product Name', full: true },
                    { k: 'brand', l: 'Brand' }, { k: 'model', l: 'Model' },
                    { k: 'price', l: 'Price ($)', type: 'number' }, { k: 'original_price', l: 'Original Price ($)', type: 'number' },
                    { k: 'storage', l: 'Storage' }, { k: 'ram', l: 'RAM' },
                    { k: 'color', l: 'Color' }, { k: 'badge', l: 'Badge' },
                    { k: 'stock', l: 'Stock', type: 'number' }, { k: 'rating', l: 'Rating', type: 'number' },
                    { k: 'review_count', l: 'Review Count', type: 'number' },
                  ].map(({ k, l, type, full }) => (
                    <div key={k} className={full ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">{l}</label>
                      <input type={type || 'text'} value={form[k as keyof typeof form]} onChange={f(k as keyof typeof form)} className="input-primary w-full rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Featured</label>
                    <select value={form.featured} onChange={f('featured')} className="input-primary w-full rounded-lg px-4 py-2.5 text-sm bg-white">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Description</label>
                    <textarea value={form.description} onChange={f('description')} rows={3} className="input-primary w-full rounded-lg px-4 py-2.5 text-sm resize-none" />
                  </div>

                  <p className="sm:col-span-2 font-mono text-primary text-xs uppercase tracking-widest border-t border-primary/20 pt-4 mt-2">Specs</p>
                  {[
                    { k: 'display', l: 'Display' }, { k: 'processor', l: 'Processor' },
                    { k: 'battery', l: 'Battery' }, { k: 'camera', l: 'Camera' },
                    { k: 'os', l: 'OS' }, { k: 'charging', l: 'Charging' },
                  ].map(({ k, l }) => (
                    <div key={k}>
                      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">{l}</label>
                      <input value={form[k as keyof typeof form]} onChange={f(k as keyof typeof form)} className="input-primary w-full rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModalOpen(false)} className="btn-outline-primary px-6 py-3 rounded-sm text-sm">
                    <span>Cancel</span>
                  </button>
                  <motion.button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 rounded-sm text-sm flex items-center justify-center gap-2" whileHover={{ scale: saving ? 1 : 1.01 }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editProduct ? 'Save Changes' : 'Create Product')}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


