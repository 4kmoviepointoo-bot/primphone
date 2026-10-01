import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, Smartphone, Zap
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { login, register, googleAuth } from '@/api/client'
import { GoogleLogin } from '@react-oauth/google'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setAuth } = useAuthStore()

  // Determine initial mode based on route
  const isRegisterRoute = location.pathname.includes('register') || location.pathname.includes('signup')
  const [mode, setMode] = useState<'login' | 'register'>(isRegisterRoute ? 'register' : 'login')

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  useEffect(() => {
    setMode(isRegisterRoute ? 'register' : 'login')
  }, [isRegisterRoute])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/shop')
    }
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let result
      if (mode === 'login') {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }
      setAuth(result.user, result.token)
      navigate('/shop')
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
          (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
          'Invalid credentials. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo fill
  const handleQuickDemo = () => {
    setMode('login')
    setFormData({
      name: '',
      email: 'admin@primphone.com',
      password: 'admin123'
    })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient background blurbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Visual Brand & Mobile Showcase (Visible on larger screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

          {/* Top Brand Pill */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              PRIME ID · GOOGLE PIXEL
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-display text-3xl font-light text-slate-800 leading-tight">
              One account for your entire <span className="font-semibold text-primary">Pixel ecosystem.</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Sign in to manage your orders, track shipments, unlock member discounts, and enjoy priority concierge delivery.
            </p>
          </div>

          {/* Floating Phone Artwork */}
          <div className="my-8 flex justify-center">
            <motion.div 
              className="relative w-52 h-64 rounded-2xl bg-white p-3 border border-slate-200 shadow-xl flex items-center justify-center overflow-hidden"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img 
                src="https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg" 
                alt="Pixel 9 Pro XL" 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-md"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-xl p-2 border border-slate-100 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-600 truncate font-medium">Tensor G4 · Verified</span>
              </div>
            </motion.div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            {[
              'Exclusive member pricing & trade-in bonus',
              'Fast 2-day insured express courier shipping',
              'Official 2-year warranty & concierge return'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Stylish Sign In / Sign Up Form */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto">
          <motion.div 
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="font-display text-2xl font-light tracking-[0.15em]">
                  <span className="text-primary font-semibold">PRIME</span>
                  <span className="text-slate-800">PHONE</span>
                </span>
              </Link>
              
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-body">
                {mode === 'login' 
                  ? 'Access your orders and curated Google Pixel collection' 
                  : 'Join the premier destination for flagship smartphones'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 relative">
              <button
                type="button"
                onClick={() => { setMode('login'); setError('') }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all relative z-10 ${
                  mode === 'login' 
                    ? 'text-slate-800 shadow-sm bg-white' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError('') }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all relative z-10 ${
                  mode === 'register' 
                    ? 'text-slate-800 shadow-sm bg-white' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Login Pill */}
            {mode === 'login' && (
              <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">Test Demo Account</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">admin@primphone.com</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all flex-shrink-0 shadow-xs"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* Google Sign In Option */}
            <div className="flex justify-center mb-6 w-full [&>div]:w-full [&>div>div]:w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoading(true)
                  setError('')
                  try {
                    const res = await googleAuth(credentialResponse.credential!)
                    setAuth(res.user, res.token)
                    navigate('/shop')
                  } catch (err: unknown) {
                    const msg = (err as any)?.response?.data?.error || (err as any)?.response?.data?.message || (err instanceof Error ? err.message : 'Google sign-in failed.');
                    setError(msg)
                  } finally {
                    setLoading(false)
                  }
                }}
                onError={() => {
                  setError('Google Sign-In failed')
                }}
                useOneTap={false}
                shape="rectangular"
                theme="outline"
                text="continue_with"
                size="large"
                width="100%"
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <span className="relative px-4 text-xs font-mono text-slate-400 bg-white uppercase tracking-wider">
                Or with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Morgan"
                      required
                      className="w-full rounded-xl pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setError('Password reset instructions sent to your email (demo mode).')}
                      className="text-xs text-primary hover:underline font-mono"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl pl-10 pr-11 py-3 bg-slate-50 border border-slate-200/90 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                />
                <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer select-none font-body">
                  Remember this device for 30 days
                </label>
              </div>

              {error && (
                <motion.div
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Submit CTA */}
              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 mt-3 text-sm font-semibold tracking-wide"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to PrimePhone' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom Footer Note */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit SSL Protected Prime ID</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
