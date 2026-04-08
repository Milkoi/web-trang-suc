import React from 'react';
import './footerCustomer.css';
// Import logo nếu ông để trong thư mục assets
import logoImg from "/src/assets/anh/logo111.jpg";
const footerCustomer = () => {
    return (
        <footer>
            <div className="cuoit">
                {/* Cột 1 */}
                <div className="cot cot1">
                    {/* Nếu ông để ảnh trong public thì dùng src="/anh/logo..." 
                        Nếu để trong assets thì dùng {logoFooter} */}
                    <img src={logoImg} alt="Logo Luxury" />

                    <p className="icon-f"><i className="fas fa-mobile"></i> (+84) 352 234 487</p>
                    <p className="icon-f"><i className="fas fa-phone-alt"></i> 1900 520 131</p>
                    <p className="icon-f"><i className="fas fa-envelope"></i> luxury@gmail.com</p>
                    <p className="icon-f">
                        <i className="fas fa-map-marker-alt"></i> 51 P. Nguyễn Hoàng, Mỹ Đình, Nam Từ Liêm, Hà Nội
                    </p>
                    <p className="icon-f"><i className="fas fa-clock"></i> Thứ 2 - CN: 8:00 - 23:00</p>
                </div>

                {/* Cột 2 */}
                <div className="cot cot2">
                    <h5>DỊCH VỤ KHÁCH HÀNG</h5>
                    <hr style={{ border: 'none', height: '1.5px', background: 'rgb(231, 132, 90)', width: '50%' }} />
                    <p>Điều khoản và điều kiện</p>
                    <p>Chính sách trả hàng hoàn tiền</p>
                    <p>Chính sách giao hàng</p>
                    <p>Chính sách quyền riêng tư</p>
                    <p>Hướng dẫn mua hàng online</p>
                </div>

                {/* Cột 3 */}
                <div className="cot cot3">
                    <h5>THÔNG TIN CHUNG</h5>
                    <hr style={{ border: 'none', height: '1.5px', background: 'rgb(231, 132, 90)', width: '50%' }} />
                    <p>Tin trang sức</p>
                    <p>Quyền lợi thành viên</p>
                    <p>Tiếp thị liên kết Luxury</p>
                    <p>Ưu đãi khi đánh giá</p>
                    <p>Nhận quà tri ân</p>
                    <p>Liên hệ</p>
                </div>

                {/* Cột 4 */}
                <div className="cot">
                    <h5>Ý KIẾN ĐÓNG GÓP</h5>
                    <hr style={{ border: 'none', height: '1.5px', background: 'rgb(231, 132, 90)', width: '50%' }} />
                    <p>Luxury luôn mong nhận được ý kiến đóng góp từ bạn để nâng cấp dịch vụ và sản phẩm tốt hơn</p>
                    <p>Nếu bạn có ý kiến, đừng ngần ngại đóng góp cho Luxury nhé. Luxury xin cảm ơn!</p>
                    <button type="button">GỬI Ý KIẾN</button>
                </div>
            </div>
            <div className="chan">©2025 NNNLUXURY</div>
        </footer>
    );
};

export default footerCustomer;