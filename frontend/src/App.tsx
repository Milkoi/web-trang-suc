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
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import CategoryList from './pages/admin/CategoryList';
import OrderList from './pages/admin/OrderList';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="customers" element={<AdminPlaceholder title="Quản lý Khách hàng" />} />
                <Route path="settings" element={<AdminPlaceholder title="Cấu hình hệ thống" />} />
              </Route>

              {/* Customer Routes */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <main style={{ paddingTop: '96px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Routes>
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
                    <CartDrawer />
                    <AuthModal />
                  </>
                }
              />
            </Routes>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
