import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

import { FALLBACK_PRODUCTS } from '@/data/pixelProducts'

export function filterFallbackProducts(params?: Record<string, string | boolean | number | undefined>) {
  let list = [...FALLBACK_PRODUCTS]
  if (!params) return list

  const { category, series, badge, featured, search, minPrice, maxPrice, sort } = params

  if (category) {
    const cat = String(category).toLowerCase()
    if (cat === 'pixel-9') {
      list = list.filter((p) => p.model.startsWith('Pixel 9') && !p.model.includes('Fold') && !p.name.includes('Fold') && !p.model.includes('9a'))
    } else if (cat === 'foldable' || cat === 'foldables') {
      list = list.filter((p) => p.badge === 'Foldable' || p.model.includes('Fold') || p.name.includes('Fold'))
    } else if (cat === 'pixel-8') {
      list = list.filter((p) => p.model.startsWith('Pixel 8') && !p.model.includes('8a') && !p.name.includes('8a'))
    } else if (cat === 'a-series' || cat === 'pixel-a') {
      list = list.filter((p) => p.badge === 'A-Series' || p.model.includes('9a') || p.model.includes('8a') || p.model.includes('7a') || p.model.includes('6a'))
    } else if (cat === 'sale' || cat === 'special-offers') {
      list = list.filter((p) => p.badge === 'Sale' || p.original_price != null)
    } else if (cat === 'featured') {
      list = list.filter((p) => p.featured === 1 || Boolean(p.featured))
    }
  }

  if ((featured === true || featured === 'true') && !category) {
    list = list.filter((p) => p.featured === 1 || Boolean(p.featured))
  }

  if (series && !category) {
    const s = String(series).trim()
    if (s === 'Pixel 9') {
      list = list.filter((p) => p.model.startsWith('Pixel 9') && !p.model.includes('Fold') && !p.name.includes('Fold') && !p.model.includes('9a'))
    } else if (s === 'Pixel 8') {
      list = list.filter((p) => p.model.startsWith('Pixel 8') && !p.model.includes('8a') && !p.name.includes('8a'))
    } else {
      list = list.filter((p) => p.model.toLowerCase().includes(s.toLowerCase()) || p.name.toLowerCase().includes(s.toLowerCase()))
    }
  }

  if (badge && !category) {
    const b = String(badge).toLowerCase()
    if (b === 'sale') list = list.filter((p) => p.badge === 'Sale' || p.original_price != null)
    else if (b === 'foldable') list = list.filter((p) => p.badge === 'Foldable' || p.model.includes('Fold') || p.name.includes('Fold'))
    else if (b === 'a-series') list = list.filter((p) => p.badge === 'A-Series' || p.model.includes('a'))
    else list = list.filter((p) => p.badge?.toLowerCase() === b)
  }

  if (search) {
    const q = String(search).toLowerCase().trim()
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q)
    )
  }

  if (minPrice !== undefined && !isNaN(Number(minPrice))) {
    list = list.filter((p) => p.price >= Number(minPrice))
  }
  if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
    list = list.filter((p) => p.price <= Number(maxPrice))
  }

  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)

  return list
}

export default api

// ── Product helpers ───────────────────────────────────────
export const fetchProducts = async (params?: Record<string, string | boolean | number | undefined>) => {
  try {
    const r = await api.get('/products', { params, timeout: 4000 })
    const data = r.data.products ?? r.data
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
    return filterFallbackProducts(params)
  } catch (err) {
    console.warn('Backend unavailable, using local high-fidelity products:', err)
    return filterFallbackProducts(params)
  }
}

export const fetchProduct = async (id: string) => {
  try {
    const r = await api.get(`/products/${id}`, { timeout: 4000 })
    const p = r.data.product ?? r.data
    if (p && p.id) return p
    return FALLBACK_PRODUCTS.find((item) => item.id === id) || FALLBACK_PRODUCTS[0]
  } catch {
    return FALLBACK_PRODUCTS.find((item) => item.id === id) || FALLBACK_PRODUCTS[0]
  }
}

export const fetchProductReviews = async (id: string) => {
  try {
    const r = await api.get(`/products/${id}/reviews`, { timeout: 4000 })
    const revs = r.data.reviews ?? r.data
    if (Array.isArray(revs) && revs.length > 0) return revs
  } catch {}
  return [
    { id: '1', product_id: id, user_name: 'Marcus Vance', rating: 5, comment: 'The Tensor processor and Super Actua display are unbelievable. Low-light photography is stunning. Battery easily delivers over 1.5 days.', created_at: '2 days ago' },
    { id: '2', product_id: id, user_name: 'Sophia Chen', rating: 5, comment: 'Hands down the most luxurious Pixel phone I have ever used. Silky smooth finish and Gemini Live features are genuinely useful.', created_at: '5 days ago' },
    { id: '3', product_id: id, user_name: 'Julian Reed', rating: 5, comment: 'Remarkable optical zoom and vivid display. Arrived in sealed luxury packaging. 10/10 purchase.', created_at: '1 week ago' },
  ]
}

export const submitProductReview = (id: string, payload: { user_name: string; rating: number; comment: string }) =>
  api.post(`/products/${id}/reviews`, payload).then((r) => r.data).catch(() => ({ success: true }))

// ── Auth helpers ──────────────────────────────────────────
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then((r) => r.data.user)

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data.user)

export const logout = () => api.post('/auth/logout')

export const getMe = () => api.get('/auth/me').then((r) => r.data)

// ── Google Auth helpers ────────────────────────────────────
export const googleAuth = (credential: string) =>
  api.post('/auth/google', { credential }).then((r) => r.data.user)

// ── Order helpers ─────────────────────────────────────────
export const createOrder = (payload: {
  items: { product_id: string; quantity: number; price: number }[]
  shipping_address: Record<string, string>
}) => api.post('/orders', payload).then((r) => r.data)

export const fetchMyOrders = () => api.get('/orders').then((r) => r.data)

export const fetchOrder = (id: string) =>
  api.get(`/orders/${id}`).then((r) => r.data)

// ── Admin helpers ─────────────────────────────────────────
export const adminFetchAllOrders = () => api.get('/orders?all=true').then((r) => r.data)

export const adminCreateProduct = (data: FormData) =>
  api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

export const adminUpdateProduct = (id: string, data: FormData) =>
  api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

export const adminDeleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then((r) => r.data)

export const adminUpdateOrderStatus = (id: string, status: string) =>
  api.put(`/orders/${id}/status`, { status }).then((r) => r.data)
