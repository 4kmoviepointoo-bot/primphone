import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AuthModal from '@/components/AuthModal'
import ParticleBackground from '@/components/ParticleBackground'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import Home from '@/pages/Home'

const Shop = lazy(() => import('@/pages/Shop'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))
const MyOrders = lazy(() => import('@/pages/MyOrders'))
const StaticPage = lazy(() => import('@/pages/StaticPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('@/pages/admin/Products'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders'))

export default function App() {
  return (
    <BrowserRouter>
      <ParticleBackground />
      <Navbar />
      <CartDrawer />
      <AuthModal />

      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

            {/* Auth Pages */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Dedicated pages for sections */}
            <Route path="/about" element={<StaticPage />} />
            <Route path="/faq" element={<StaticPage />} />
            <Route path="/contact" element={<StaticPage />} />
            <Route path="/shipping-info" element={<StaticPage />} />
            <Route path="/returns" element={<StaticPage />} />
            <Route path="/careers" element={<StaticPage />} />
            <Route path="/press" element={<StaticPage />} />
            <Route path="/blog" element={<StaticPage />} />
            <Route path="/privacy-policy" element={<StaticPage />} />
            <Route path="/terms-of-service" element={<StaticPage />} />
            <Route path="/cookie-policy" element={<StaticPage />} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Footer />
    </BrowserRouter>
  )
}
