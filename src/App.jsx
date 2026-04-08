import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/CustomerComponents/navbarCustomer';
import Footer from './components/CustomerComponents/FooterCustomer';
import Home from './pages/customerpages/HomeCustomer';

function App() {
  return (
    <BrowserRouter>
      <div id="app-wrapper">
        {/* 1. Luôn hiện ở trên */}
        <Navbar /> 

        {/* 2. Phần thân: Chứa nội dung trang chủ */}
        <main id="center">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Sau này thêm trang khác thì viết Route vào đây */}
          </Routes>
        </main>

        {/* 3. Luôn hiện ở dưới */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;