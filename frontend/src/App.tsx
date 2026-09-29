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
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import MyOrders from '@/pages/MyOrders'
import StaticPage from '@/pages/StaticPage'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AdminOrders from '@/pages/admin/Orders'
import AuthPage from '@/pages/AuthPage'

export default function App() {
  return (
    <BrowserRouter>
      <ParticleBackground />
      <Navbar />
      <CartDrawer />
      <AuthModal />

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

      <Footer />
    </BrowserRouter>
  )
}


