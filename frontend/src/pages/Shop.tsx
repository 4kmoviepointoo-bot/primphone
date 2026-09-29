import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, Smartphone, Layers, Tag, Star, RotateCcw } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchProducts } from '@/api/client'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import { type Product } from '@/store/cartStore'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const priceRanges = [
  { label: 'All Prices', min: 0, max: 9999 },
  { label: 'Under $600', min: 0, max: 600 },
  { label: '$600 – $1,000', min: 600, max: 1000 },
  { label: '$1,000 – $1,500', min: 1000, max: 1500 },
  { label: 'Over $1,500', min: 1500, max: 9999 },
]

const categories = [
  { id: 'all', label: 'All Devices', icon: Smartphone, queryParam: {} },
  { id: 'pixel-9', label: 'Pixel 9 Series', icon: Sparkles, queryParam: { series: 'Pixel 9' } },
  { id: 'foldable', label: 'Foldables', icon: Layers, queryParam: { badge: 'Foldable' } },
  { id: 'pixel-8', label: 'Pixel 8 Series', icon: Smartphone, queryParam: { series: 'Pixel 8' } },
  { id: 'a-series', label: 'Pixel A-Series', icon: Tag, queryParam: { search: '9a' } },
  { id: 'sale', label: 'Special Offers', icon: Tag, queryParam: { badge: 'Sale' } },
  { id: 'featured', label: 'Featured', icon: Star, queryParam: { featured: true } },
]

export default function Shop() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(query.get('search') || '')
  const [sort, setSort] = useState('newest')
  const [priceRange, setPriceRange] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  // Detect active category from URL
  const seriesParam = query.get('series')
  const badgeParam = query.get('badge')
  const featuredParam = query.get('featured') === 'true'

  let initialCategory = 'all'
  if (featuredParam) initialCategory = 'featured'
  else if (badgeParam === 'Foldable') initialCategory = 'foldable'
  else if (badgeParam === 'Sale') initialCategory = 'sale'
  else if (seriesParam === 'Pixel 9') initialCategory = 'pixel-9'
  else if (seriesParam === 'Pixel 8') initialCategory = 'pixel-8'

  const [activeCategory, setActiveCategory] = useState(initialCategory)

  // Sync category state when URL changes
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    const s = q.get('series')
    const b = q.get('badge')
    const f = q.get('featured') === 'true'
    const searchVal = q.get('search') || ''

    if (f) setActiveCategory('featured')
    else if (b === 'Foldable') setActiveCategory('foldable')
    else if (b === 'Sale') setActiveCategory('sale')
    else if (s === 'Pixel 9') setActiveCategory('pixel-9')
    else if (s === 'Pixel 8') setActiveCategory('pixel-8')
    else if (searchVal === '9a') setActiveCategory('a-series')
    else if (!s && !b && !f) setActiveCategory('all')
    
    setSearch(searchVal)
  }, [location.search])

  const load = useCallback(() => {
    setLoading(true)
    const params: Record<string, string | boolean | number> = { sort }
    if (search) params.search = search

    // Category overrides
    if (activeCategory === 'featured') params.featured = true
    else if (activeCategory === 'pixel-9') params.series = 'Pixel 9'
    else if (activeCategory === 'pixel-8') params.series = 'Pixel 8'
    else if (activeCategory === 'foldable') params.badge = 'Foldable'
    else if (activeCategory === 'sale') params.badge = 'Sale'
    else if (activeCategory === 'a-series' && !search) params.search = 'a'

    const range = priceRanges[priceRange]
    if (range.min > 0) params.minPrice = range.min
    if (range.max < 9999) params.maxPrice = range.max

    fetchProducts(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, sort, priceRange, activeCategory])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId)
    const target = categories.find((c) => c.id === catId)
    if (!target) return

    const newQuery = new URLSearchParams()
    if (target.queryParam.featured) newQuery.set('featured', 'true')
    if (target.queryParam.series) newQuery.set('series', target.queryParam.series)
    if (target.queryParam.badge) newQuery.set('badge', target.queryParam.badge)
    if (target.queryParam.search) newQuery.set('search', target.queryParam.search)

    navigate(`/shop${newQuery.toString() ? `?${newQuery.toString()}` : ''}`, { replace: true })
  }

  const handleResetFilters = () => {
    setSearch('')
    setPriceRange(0)
    setActiveCategory('all')
    setSort('newest')
    navigate('/shop', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <ScrollReveal>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-primary text-xs uppercase tracking-widest font-semibold">
              Curated Showcase
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                {activeCategory === 'featured' ? 'Featured Devices' : 'Google Pixel Collection'}
              </h1>
              <p className="text-slate-500 mt-2 text-base max-w-xl">
                Precision engineering meets on-device Gemini AI. Explore our hand-inspected, factory-unlocked flagships.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{products.length} {products.length === 1 ? 'Device' : 'Devices'} Available</span>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── Category Filter Tabs ─────────────────────────────────── */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-300 shadow-2xs ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls bar */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models, color, specs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Toggle */}
            <motion.button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono transition-all border ${
                filtersOpen
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Price Filter</span>
              {priceRange > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </motion.button>

            {/* Sort Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:bg-slate-100 transition-colors"
                whileTap={{ scale: 0.97 }}
              >
                <span>{sortOptions.find((o) => o.value === sort)?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl py-2 z-30 border border-slate-200 shadow-xl"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors flex items-center justify-between ${
                          sort === o.value ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {o.label}
                        {sort === o.value && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear All Filters */}
            {(priceRange > 0 || search || activeCategory !== 'all') && (
              <button
                onClick={handleResetFilters}
                title="Reset All Filters"
                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded price filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              className="mt-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-3">Filter By Budget</p>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((r, i) => (
                    <motion.button
                      key={r.label}
                      onClick={() => setPriceRange(i)}
                      className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                        priceRange === i
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {r.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-4 flex flex-col justify-between">
                <div className="w-full h-56 bg-slate-100 rounded-2xl" />
                <div className="space-y-2 mt-4">
                  <div className="w-2/3 h-4 bg-slate-100 rounded-sm" />
                  <div className="w-1/3 h-4 bg-slate-100 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto px-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-800">No Pixel devices match your criteria</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              We couldn't find any smartphones matching "{search || categories.find(c => c.id === activeCategory)?.label}". Try resetting your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-primary px-8 py-3.5 rounded-full text-sm mt-6 inline-flex items-center gap-2 shadow-md shadow-primary/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
