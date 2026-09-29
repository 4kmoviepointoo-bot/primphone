import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, ArrowRight, TrendingUp, Sparkles, Smartphone, CornerDownLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '@/api/client'
import { Product } from '@/store/cartStore'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const TRENDING_TAGS = [
  'Pixel 9 Pro XL',
  'Pixel 9 Pro',
  'Pixel Fold 2',
  'Pixel 9',
  'Pixel 8 Pro',
  'Tensor G4',
]

const QUICK_PICKS = [
  {
    name: 'Pixel 9 Pro XL',
    badge: 'Flagship',
    price: '$1,299',
    tag: 'Tensor G4 · 16GB RAM',
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
  },
  {
    name: 'Pixel Fold 2',
    badge: 'Foldable',
    price: '$1,799',
    tag: '8.0" Inner Display',
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',
  },
  {
    name: 'Pixel 9 Pro',
    badge: 'New',
    price: '$1,199',
    tag: 'Pro Camera Suite',
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
  },
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Global ESC and Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Live debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const data = await fetchProducts({ search: query.trim() })
        setResults(data)
        setSelectedIndex(0)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectProduct = useCallback((id: string) => {
    onClose()
    navigate(`/products/${id}`)
  }, [navigate, onClose])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelectProduct(results[selectedIndex].id)
      }
    }
  }

  const handleTagClick = (tag: string) => {
    setQuery(tag)
    inputRef.current?.focus()
  }

  const handleViewAll = () => {
    onClose()
    navigate(`/shop?search=${encodeURIComponent(query)}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-20">
          {/* Backdrop with frosted glass */}
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2),0_0_1px_rgba(0,0,0,0.15)] border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-6 py-4.5 border-b border-slate-100 bg-white">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mr-3.5 shadow-xs">
                <Search className="w-5 h-5" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Pixel phones, Tensor G4, foldables..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg font-body"
              />

              <div className="flex items-center gap-2">
                {loading && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin mr-1" />
                )}

                {query && (
                  <motion.button
                    onClick={() => {
                      setQuery('')
                      inputRef.current?.focus()
                    }}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                    whileTap={{ scale: 0.85 }}
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                <button
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center px-2 py-1 rounded-md text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200/80 hover:text-slate-700 transition-colors"
                >
                  ESC
                </button>

                <button
                  onClick={onClose}
                  className="sm:hidden p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* STATE 1: Typing with results */}
              {query.trim().length >= 2 ? (
                <div>
                  <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {loading ? 'Searching...' : `Found ${results.length} device${results.length === 1 ? '' : 's'}`}
                    </span>
                    {results.length > 0 && (
                      <span className="text-xs font-mono text-primary cursor-pointer hover:underline" onClick={handleViewAll}>
                        View all in shop →
                      </span>
                    )}
                  </div>

                  {results.length > 0 ? (
                    <div className="space-y-2">
                      {results.map((product, index) => {
                        const isSelected = index === selectedIndex
                        return (
                          <motion.div
                            key={product.id}
                            onClick={() => handleSelectProduct(product.id)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`group relative flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-primary/5 border-primary/30 shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-100'
                            }`}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Phone Thumbnail */}
                              <div className="w-14 h-16 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg'
                                  }}
                                />
                              </div>

                              {/* Details */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-heading text-slate-800 font-semibold text-base group-hover:text-primary transition-colors truncate">
                                    {product.name}
                                  </h4>
                                  {product.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                                      {product.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  {product.storage || '128GB'} · {product.ram || '12GB RAM'} · {product.color || 'Standard'}
                                </p>
                              </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center gap-3 pl-3 flex-shrink-0">
                              <span className="font-mono text-primary font-bold text-base">
                                ${product.price.toLocaleString()}
                              </span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'
                              }`}>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : !loading ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <p className="font-heading text-lg font-semibold text-slate-700">No phones matched your search</p>
                      <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                        We couldn't find any devices matching "<span className="text-slate-600 font-medium">{query}</span>". Try searching for "Pixel 9" or "Fold".
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                /* STATE 2: Empty state with Trending Tags & Curated Picks */
                <div className="space-y-6">
                  {/* Trending Queries */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-1 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 border border-slate-200/60 hover:border-primary/20 transition-all flex items-center gap-1.5 group"
                        >
                          <Search className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated Flagship Showcase */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-1 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Featured Devices</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {QUICK_PICKS.map((pick) => (
                        <div
                          key={pick.name}
                          onClick={() => handleTagClick(pick.name)}
                          className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {pick.badge}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {pick.price}
                            </span>
                          </div>

                          <div className="h-24 w-full flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
                            <img
                              src={pick.image}
                              alt={pick.name}
                              className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xs"
                            />
                          </div>

                          <div>
                            <p className="font-heading font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors truncate">
                              {pick.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {pick.tag}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer bar with keyboard navigation shortcuts */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold shadow-2xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold shadow-2xs">↓</kbd>
                  <span className="text-[11px]">Navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold shadow-2xs flex items-center">
                    <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <span className="text-[11px]">Select</span>
                </span>
              </div>

              <span className="text-[11px] text-slate-400">
                PrimePhone Instant Search
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
