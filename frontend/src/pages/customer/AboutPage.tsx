import React from 'react';
import './AboutPage.css';

const aboutHero = 'https://png.pngtree.com/background/20210710/original/pngtree-taobao-jewelry-fresh-and-simple-gold-jewelry-poster-picture-image_1034493.jpg';
const craftImage = 'https://i.pinimg.com/474x/8f/60/27/8f6027035b85554cccf98cc19bf4a1b6.jpg?nii=t';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <img src={aboutHero} alt="Luxury Jewelry Crafting" className="about-hero__image" />
          <div className="about-hero__overlay" />
        </div>
        <div className="about-hero__content container">
          <p className="section__subtitle" style={{ color: 'var(--color-gold-light)', marginBottom: '1rem', display: 'block' }}>Về Chúng Tôi</p>
          <h1 className="about-hero__title">VELMORA<br />Jewelry House</h1>
          <p className="about-hero__desc">
            Hành trình kiến tạo vẻ đẹp vĩnh cửu từ những viên đá quý tráng lệ nhất.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section about-story">
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__text">
              <h2 className="section__title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Khởi Nguồn Đam Mê</h2>
              <div className="divider" style={{ margin: '0 0 2rem 0' }} />
              <p>
                Được thành lập vào năm 2005, VELMORA mang trong mình sứ mệnh tôn vinh vẻ đẹp Á Đông thông qua những tuyệt tác trang sức tinh xảo. Chúng tôi tin rằng mỗi món trang sức không chỉ là phụ kiện, mà còn là một câu chuyện, một di sản được lưu truyền qua nhiều thế hệ.
              </p>
              <br />
              <p>
                Từ một xưởng chế tác nhỏ giữa lòng thủ đô, VELMORA đã chuyển mình thành thương hiệu trang sức cao cấp hàng đầu, nơi kỹ thuật thủ công truyền thống kết hợp hoàn hảo cùng công nghệ chế tác hiện đại.
              </p>
            </div>
            <div className="about-story__image-wrap">
              <img src={craftImage} alt="Craftsmanship" className="about-story__image" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section about-values" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section__header">
            <p className="section__subtitle">Triết lý của chúng tôi</p>
            <h2 className="section__title">Giá Trị Cốt Lõi</h2>
            <div className="divider" />
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-card__icon">✦</div>
              <h3>Tinh Tế</h3>
              <p>Mỗi chi tiết nhỏ nhất đều được chăm chút kỹ lưỡng bởi đôi bàn tay tài hoa của nghệ nhân.</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">✧</div>
              <h3>Độc Bản</h3>
              <p>Sự kết hợp độc đáo giữa chất liệu quý hiếm và thiết kế mang đậm dấu ấn cá nhân.</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">✦</div>
              <h3>Trường Tồn</h3>
              <p>Chất lượng vượt thời gian, đồng hành cùng bạn trong những khoảnh khắc quan trọng nhất.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
