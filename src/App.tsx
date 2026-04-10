import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './store/CartContext';
import { AuthProvider } from './store/AuthContext';
import { FavoritesProvider } from './store/FavoritesContext';
import ScrollToTop from './Components/layout/ScrollToTop';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import CartDrawer from './Components/layout/CartDrawer';
import AuthModal from './Components/auth/AuthModal';
import HomePage from './pages/customer/HomePage';
import AboutPage from './pages/customer/AboutPage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import CheckoutSuccess from './pages/customer/CheckoutSuccess';
import FavoritesPage from './pages/customer/FavoritesPage';
import OrdersPage from './pages/customer/OrdersPage';
import AccountPage from './pages/customer/AccountPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            {/* Navbar is position:fixed inside, announcement bar is also fixed */}
            <Navbar />

            {/* Page Content - offset for announcement(32px) + navbar(64px) */}
            <main style={{ paddingTop: '96px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                {/* Home has full-height hero so no padding needed */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Overlays */}
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
