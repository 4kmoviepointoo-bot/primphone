import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, MapPin, Lock, ChevronRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { createOrder } from '@/api/client'
import ScrollReveal from '@/components/ScrollReveal'

const steps = ['Cart Review', 'Shipping', 'Payment']

export default function Checkout() {
  const { items, total, clearCart } = useCartStore()
  const { user, openAuthModal } = useAuthStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: '',
    zip: '',
    phone: '',
  })

  const [payment] = useState({
    cardNumber: '4111 1111 1111 1111',
    expiry: '12/28',
    cvv: '123',
    cardName: user?.name || '',
  })

  const handleField = (key: keyof typeof shipping) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setShipping((p) => ({ ...p, [key]: e.target.value }))

  const handlePlaceOrder = async () => {
    if (!user) { openAuthModal('login'); return }
    setLoading(true)
    setError('')
    try {
      const result = await createOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        shipping_address: shipping,
      })
      clearCart()
      navigate(`/order-confirmation/${result.order.id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Order failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && step === 0) {
    navigate('/shop')
    return null
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl text-slate-800">Checkout</h1>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-slate-400'}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        i < step ? 'bg-primary text-void' :
                        i === step ? 'border-2 border-primary text-primary' :
                        'border border-muted text-slate-400'
                      }`}
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className="text-sm font-mono hidden sm:inline">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-px ${i < step ? 'bg-primary' : 'bg-muted/30'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* STEP 0 — Cart Review */}
              {step === 0 && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="font-heading text-xl text-slate-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Review Cart
                  </h2>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center py-3 border-b border-slate-200">
                      <div>
                        <p className="font-heading text-slate-800">{item.product.name}</p>
                        <p className="text-slate-400 text-sm font-mono">
                          {item.product.storage} · {item.product.color} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-primary font-bold">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <motion.button
                    onClick={() => setStep(1)}
                    className="btn-primary w-full py-4 rounded-sm flex items-center justify-center gap-2 mt-4"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  >
                    Continue to Shipping <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* STEP 1 — Shipping */}
              {step === 1 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-heading text-xl text-slate-800 flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary" /> Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                      { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
                      { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8901', type: 'tel' },
                      { key: 'address', label: 'Address', placeholder: '123 Main St', full: true },
                      { key: 'city', label: 'City', placeholder: 'New York' },
                      { key: 'zip', label: 'ZIP Code', placeholder: '10001' },
                    ].map(({ key, label, placeholder, type, full }) => (
                      <div key={key} className={full ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                          {label}
                        </label>
                        <input
                          type={type || 'text'}
                          value={shipping[key as keyof typeof shipping]}
                          onChange={handleField(key as keyof typeof shipping)}
                          placeholder={placeholder}
                          className="input-primary w-full rounded-lg px-4 py-3 text-sm"
                          required
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <select
                        value={shipping.country}
                        onChange={handleField('country')}
                        className="input-primary w-full rounded-lg px-4 py-3 text-sm bg-white"
                      >
                        <option value="">Select country</option>
                        {['United States', 'United Kingdom', 'UAE', 'Canada', 'Australia', 'Germany', 'France'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(0)}
                      className="btn-outline-primary px-6 py-4 rounded-sm text-sm flex-shrink-0"
                    >
                      <span>← Back</span>
                    </button>
                    <motion.button
                      onClick={() => {
                        if (!shipping.address || !shipping.city || !shipping.country) {
                          setError('Please fill all required shipping fields.')
                          return
                        }
                        setError('')
                        setStep(2)
                      }}
                      className="btn-primary flex-1 py-4 rounded-sm text-sm flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    >
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-heading text-xl text-slate-800 flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment
                  </h2>
                  <div className="flex items-center gap-2 mb-6 text-green-400 text-sm font-mono">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL encrypted — Demo mode</span>
                  </div>

                  {/* Mock card */}
                  <motion.div
                    className="relative rounded-xl overflow-hidden h-44 mb-6 p-6 flex flex-col justify-between"
                    style={{
                      background: 'linear-gradient(135deg, #1a1208 0%, #2a1f0a 50%, #0d0a06 100%)',
                      border: '1px solid rgba(37,99,235,0.4)',
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-display text-primary text-xl font-light tracking-widest">
                        PRIME<span className="font-semibold">PHONE</span>
                      </span>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/60" />
                        <div className="w-8 h-8 rounded-full bg-primary/30" />
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-xl tracking-[0.2em] text-slate-800/90">
                        {payment.cardNumber}
                      </p>
                      <div className="flex justify-between mt-2">
                        <div>
                          <p className="text-slate-400 text-xs font-mono">CARD HOLDER</p>
                          <p className="text-slate-800 text-sm font-mono">{payment.cardName || 'YOUR NAME'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs font-mono">EXPIRES</p>
                          <p className="text-slate-800 text-sm font-mono">{payment.expiry}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <p className="text-xs text-slate-500 text-center mb-6 font-mono">
                    This is a mock checkout — no real payment is processed.
                  </p>

                  {error && (
                    <motion.p
                      className="text-red-400 text-sm text-center mb-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-outline-primary px-6 py-4 rounded-sm text-sm">
                      <span>← Back</span>
                    </button>
                    <motion.button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary flex-1 py-4 rounded-sm text-sm flex items-center justify-center gap-2"
                      whileHover={{ scale: loading ? 1 : 1.01 }}
                      whileTap={{ scale: loading ? 1 : 0.99 }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>Place Order — ${total().toFixed(2)}</>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="glass-primary rounded-2xl p-5 lg:sticky lg:top-24">
              <h3 className="font-heading text-lg text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-slate-500 truncate max-w-[130px]">
                      {item.product.name} <span className="text-slate-400">×{item.quantity}</span>
                    </span>
                    <span className="font-mono text-slate-800">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="divider-primary my-4" />
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Shipping</span>
                <span className="text-green-400 font-mono">Free</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="font-heading text-slate-800">Total</span>
                <span className="font-mono text-primary text-xl">${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


