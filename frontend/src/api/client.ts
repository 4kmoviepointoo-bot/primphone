import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: '/api/v1',
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

export default api

// ── Product helpers ───────────────────────────────────────
export const fetchProducts = (params?: Record<string, string | boolean | number>) =>
  api.get('/products', { params }).then((r) => r.data.products ?? r.data)

export const fetchProduct = (id: string) =>
  api.get(`/products/${id}`).then((r) => r.data.product ?? r.data)

export const fetchProductReviews = (id: string) =>
  api.get(`/products/${id}/reviews`).then((r) => r.data.reviews ?? r.data)

export const submitProductReview = (id: string, payload: { user_name: string; rating: number; comment: string }) =>
  api.post(`/products/${id}/reviews`, payload).then((r) => r.data)

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
