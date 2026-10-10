import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/frontpages/Dashboard'
import Products from './pages/frontpages/Products'
import ProductDetail from './pages/frontpages/ProductDetail'
import Cart from './pages/frontpages/Cart'
import Checkout from './pages/frontpages/Checkout'
import NotFound from './pages/frontpages/NotFound'

// Semua halaman dibungkus MainLayout, perpindahan halaman tidak me-reload browser (SPA).
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
