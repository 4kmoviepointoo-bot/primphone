import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, User, Menu, X, ChevronDown, LogOut, Package, 
  LayoutDashboard, Search, FileText, ShieldCheck, Cookie,
  Sparkles, Layers, Smartphone, Tag
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import SearchModal from './SearchModal'

const navLinks = [
  { href: '/shop', label: 'All Phones' },
  { href: '/shop?featured=true', label: 'Featured' },
  { href: '/about', label: 'About' },
]

const categoryLinks = [
  { 
    href: '/shop?series=Pixel 9', 
    label: 'Pixel 9 Series', 
    desc: 'Gemini AI & Tensor G4 flagships', 
    icon: <Sparkles className="w-4 h-4 text-primary" /> 
  },
  { 
    href: '/shop?badge=Foldable', 
    label: 'Pixel Foldable', 
    desc: 'Dual OLED & seamless hinge', 
    icon: <Layers className="w-4 h-4 text-indigo-500" /> 
  },
  { 
    href: '/shop?series=Pixel 8', 
    label: 'Pixel 8 Series', 
    desc: 'Tensor G3 everyday powerhouses', 
    icon: <Smartphone className="w-4 h-4 text-sky-500" /> 
  },
  { 
    href: '/shop?search=9a', 
    label: 'Pixel A-Series', 
    desc: 'Clean Android at unbeatable value', 
    icon: <Tag className="w-4 h-4 text-emerald-500" /> 
  },
  { 
    href: '/shop?badge=Sale', 
    label: 'Special Offers', 
    desc: 'Seasonal hardware discounts', 
    icon: <Tag className="w-4 h-4 text-amber-500" /> 
  },
]

const policyLinks = [
  { 
    href: '/terms-of-service', 
    label: 'Terms of Service', 
    desc: 'Hardware & warranty agreement', 
    icon: <FileText className="w-4 h-4 text-primary" /> 
  },
  { 
    href: '/privacy-policy', 
    label: 'Privacy Policy', 
    desc: '256-bit encryption & data rights', 
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
  },
  { 
    href: '/cookie-policy', 
    label: 'Cookie Policy', 
    desc: 'Session & store preferences', 
    icon: <Cookie className="w-4 h-4 text-amber-500" /> 
  },
]

export default function Navbar() {
  const { itemCount, openCart } = useCartStore()
  const { user, openAuthModal, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [policiesOpen, setPoliciesOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  
  const policiesRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { scrollY } = useScroll()

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
    setSearchOpen(false)
    setPoliciesOpen(false)
    setCategoriesOpen(false)
  }, [location.pathname])

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (policiesRef.current && !policiesRef.current.contains(event.target as Node)) {
        setPoliciesOpen(false)
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global Cmd+K / Ctrl+K shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const count = itemCount()
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20))
    return () => unsub()
  }, [scrollY])

  const isExpanded = scrolled || menuOpen

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none ${
          isExpanded ? 'pt-0 px-0' : 'pt-4 px-4 sm:px-6'
        }`}
      >
      <div 
        className={`pointer-events-auto relative w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-between ${
          isExpanded
            ? 'max-w-full bg-white shadow-md rounded-none h-16 px-6 border-b border-slate-200'
            : 'max-w-6xl bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/20 rounded-full h-16 px-6 sm:px-8 border border-white/60 ring-1 ring-slate-900/5'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <LogoMark />
          <span className="font-display text-2xl font-light tracking-[0.15em] hidden sm:block">
            <span className="text-primary font-semibold">PRIME</span>
            <span className="text-slate-800">PHONE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/shop"
            className="font-mono text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors duration-300 animated-underline"
          >
            All Phones
          </Link>

          {/* Series / Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 py-1 ${
                categoriesOpen ? 'text-primary' : 'text-slate-600 hover:text-primary'
              }`}
            >
              <span>Series</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Pixel Lineup
                    </span>
                  </div>
                  {categoryLinks.map((c) => (
                    <Link
                      key={c.href}
                      to={c.href}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-primary transition-colors">
                          {c.label}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {c.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/shop?featured=true"
            className="font-mono text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors duration-300 animated-underline"
          >
            Featured
          </Link>
          <Link
            to="/about"
            className="font-mono text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors duration-300 animated-underline"
          >
            About
          </Link>

          {/* Policies Dropdown */}
          <div className="relative" ref={policiesRef}>
            <button
              onClick={() => setPoliciesOpen(!policiesOpen)}
              className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 py-1 ${
                policiesOpen ? 'text-primary' : 'text-slate-600 hover:text-primary'
              }`}
            >
              <span>Policies</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${policiesOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            <AnimatePresence>
              {policiesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Legal & Policies
                    </span>
                  </div>
                  {policyLinks.map((p) => (
                    <Link
                      key={p.href}
                      to={p.href}
                      onClick={() => setPoliciesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                        {p.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-primary transition-colors">
                          {p.label}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {p.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Stylish Search Trigger */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/70 text-slate-500 hover:text-slate-800 transition-all text-xs font-body group shadow-2xs"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Search Pixel phones"
          >
            <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 font-mono tracking-tight text-[11px]">Search devices...</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-2xs">
              ⌘K
            </kbd>
          </motion.button>

          <motion.button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden relative w-10 h-10 rounded-full glass flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative w-10 h-10 rounded-full glass flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={count}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User */}
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User account menu"
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full glass hover:border-primary/30 border border-transparent transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-slate-800 hidden sm:block font-mono">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 hidden sm:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl py-2 border border-slate-100 shadow-xl"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-100 mb-1 truncate">
                      {user.email}
                    </p>
                    <DropdownItem
                      icon={<Package className="w-4 h-4" />}
                      label="My Orders"
                      onClick={() => { navigate('/orders'); setUserMenuOpen(false) }}
                    />
                    {user.role === 'admin' && (
                      <DropdownItem
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Admin"
                        onClick={() => { navigate('/admin'); setUserMenuOpen(false) }}
                      />
                    )}
                    <DropdownItem
                      icon={<LogOut className="w-4 h-4" />}
                      label="Sign Out"
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      danger
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => openAuthModal('login')}
              className="btn-outline-primary px-4 py-2 rounded-full text-xs hidden sm:flex items-center gap-1.5 shadow-2xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Sign In</span>
            </motion.button>
          )}

          {/* Mobile menu toggle */}
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg pointer-events-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col py-4 px-6 gap-1">

              {/* ── CTA Section at top ── */}
              {user ? (
                /* Logged in: greet user */
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                /* Guest: Show Sign In + Sign Up CTAs */
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex flex-col gap-2 mb-3 pb-4 border-b border-slate-100"
                >
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">
                    Your Account
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { openAuthModal('login'); setMenuOpen(false) }}
                      className="flex-1 py-3 rounded-full text-sm font-bold font-mono border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all min-h-[48px]"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { openAuthModal('register'); setMenuOpen(false) }}
                      className="flex-1 btn-primary py-3 rounded-full text-sm font-bold min-h-[48px] shadow-md shadow-primary/25"
                    >
                      Sign Up
                    </button>
                  </div>
                </motion.div>
              )}

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="font-mono text-sm text-slate-600 hover:text-primary transition-colors uppercase tracking-widest flex items-center min-h-[44px] px-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Series Section */}
              <div className="pt-3 border-t border-slate-100 space-y-0.5 mt-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 block mb-1">
                  Pixel Series
                </span>
                {categoryLinks.map((c) => (
                  <Link
                    key={c.href}
                    to={c.href}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-mono text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors min-h-[44px]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {c.icon}
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Policies & Legal Section */}
              <div className="pt-3 border-t border-slate-100 space-y-0.5 mt-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 block mb-1">
                  Policies &amp; Legal
                </span>
                {policyLinks.map((p) => (
                  <Link
                    key={p.href}
                    to={p.href}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-mono text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors min-h-[44px]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </Link>
                ))}
              </div>

              {/* Logged-in user: Sign Out at bottom */}
              {user && (
                <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
                  <Link
                    to="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold font-mono bg-slate-900 text-white hover:bg-slate-700 transition-all min-h-[48px] shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop All Phones
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-mono text-red-500 hover:bg-red-50 transition-all min-h-[44px] border border-red-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Luxury Spotlight Search Modal */}
    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  )
}

function DropdownItem({
  icon, label, onClick, danger = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-primary hover:bg-slate-50'
      }`}
      whileHover={{ x: 4 }}
    >
      {icon}
      <span className="font-mono">{label}</span>
    </motion.button>
  )
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.3)" strokeWidth="1"/>
      <path d="M10 8h12v4H10zM10 14h8v4H10zM10 20h12v4H10z" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="20" y="14" width="4" height="10" rx="1" fill="#2563EB" opacity="0.4"/>
    </svg>
  )
}


