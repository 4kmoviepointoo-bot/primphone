import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2, Mail, Lock, User, Smartphone, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { login, register, googleAuth } from '@/api/client'
import { GoogleLogin } from '@react-oauth/google'

export default function AuthModal() {
  const { isAuthModalOpen, authMode, closeAuthModal, setAuthMode, setAuth } = useAuthStore()

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthModalOpen) {
      setError('')
      setFormData({ name: '', email: '', password: '' })
    }
  }, [isAuthModalOpen])

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
      if (authMode === 'login') {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }
      setAuth(result.user, result.token)
      closeAuthModal()
      setFormData({ name: '', email: '', password: '' })
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

  const handleQuickDemo = () => {
    setAuthMode('login')
    setFormData({
      name: '',
      email: 'admin@primphone.com',
      password: 'admin123'
    })
    setError('')
  }

  // Note: handleGoogleSignIn manual function removed because we will use <GoogleLogin /> component

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
          />

          {/* Modal Container */}
          <motion.div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-slate-200/90 relative z-10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-800">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {authMode === 'login' ? 'Sign in to access your PrimePhone orders' : 'Join the Google Pixel luxury flagship store'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError('') }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError('') }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Quick Demo Fill Pill (For fast testing) */}
            {authMode === 'login' && (
              <div className="mb-4 p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 truncate">Demo Account: admin@primphone.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="px-2.5 py-1 rounded-md bg-primary text-white text-[11px] font-semibold hover:bg-primary-dark transition-all flex-shrink-0"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* Google Sign In Option */}
            <div className="flex justify-center mb-4 w-full [&>div]:w-full [&>div>div]:w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoading(true)
                  setError('')
                  try {
                    const res = await googleAuth(credentialResponse.credential!)
                    setAuth(res.user, res.token)
                    closeAuthModal()
                    setFormData({ name: '', email: '', password: '' })
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
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-3 text-[11px] font-mono text-slate-400 bg-white uppercase tracking-wider">
                Or with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1">
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
                      className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1">
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
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-1">
                  Password
                </label>
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
                    className="w-full rounded-xl pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 mt-2 text-sm font-semibold"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom guarantee */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit SSL Protected Prime ID</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
