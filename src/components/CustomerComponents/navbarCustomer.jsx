import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbarCustomer.css'; // File chứa CSS của bạn
import logoImg from "/src/assets/anh/logo111.jpg";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hienra = (val) => {
      setIsMenuOpen(!isMenuOpen);
      console.log("Tham số truyền vào:", val); // Giữ lại cái 'b' nếu ông cần dùng logic khác
    };
  return (
    <>
      <header>
        {/* Phần dải thông báo */}
        <div className="giaohang">
          <span id="giao">Giao hàng miễn phí cho đơn trên 10.000.000đ</span>
          <span id="inf">inf@luxelum.global</span>
        </div>

        {/* Phần Thanh Logo & Menu */}
        <div className="thanhlogo">
          <div className="logo anh">
            <a href="#">
              {/* Chú ý: Đường dẫn ảnh phải để trong thư mục public hoặc import vào */}
              <img src={logoImg} alt="Logo" /> 
            </a>
          </div>

          <div className="logo dmsp-cha">
            <button className="dmsp-con">
              <i className="fas fa-bars"></i>
              <div id="tieu-de-dmsp">Danh mục sản phẩm</div>
            </button>
            <div className="con-dmsp">
              <div className="con2">
                <div>Dây chuyền</div>
                <div>Lắc chân</div>
                <div>Lắc tay</div>
                <div>Nhẫn</div>
              </div>
            </div>
          </div>

          {/* Ô tìm kiếm */}
          <div className="search logo">
            <input type="text" className="timkiem" placeholder="Nhập sản phẩm cần tìm kiếm" />
            <button className="nut-tim-kiem">
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Các icon tiện ích */}
          <div className="logo muc-khac">
            <div className="icon-muc taikhoan">
              <i className="far fa-user"></i>
            </div>
            <button className="icon-muc like">
              <i className="far fa-heart"></i>
            </button>
            <button className="icon-muc giohang">
              <i className="fab fa-opencart"></i>
            </button>
            <button className="icon-muc bell">
              <i className="far fa-bell"></i>
            </button>
          </div>

          <a href="#" className="lienhe">
            <i className="fas fa-headset"></i>
          </a>
        </div>
      </header>


      <ul className={`menu ${isMenuOpen ? 'active' : ''}`}>
        <button className="menu-an" type="button" onClick={() => hienra()}>
          <i className="fas fa-bars"></i>
        </button>

        <li className="trai">
          <Link id="trangchu" to="/">Trang chủ</Link>
          <Link to="/gioithieu">Giới thiệu</Link>
          <Link to="/sanpham">Sản phẩm</Link>
          <Link to="/lienhe">Liên hệ</Link>        
        </li>

        <li className="phai">
          <Link className="hot" to="/hot">
            <i className="fas fa-crown"></i>
            <span><b>Hot</b></span>
          </Link>
          
          <Link className="sale" to="/sale">
            <i className="fas fa-percentage"></i>
            <span><b>Sale</b></span>
          </Link>
                    
          <div className="sp-da-xem">
            <div className="cha">
            <p>Sản phẩm đã xem</p>
            <i className="fas fa-angle-up"></i>
            </div>
            {/* <div className="cha2">Không có sản phẩm xem gần đây
            </div>  */}
          </div>
        </li>
      </ul>
    
    </>
  );
};

export default Navbar;