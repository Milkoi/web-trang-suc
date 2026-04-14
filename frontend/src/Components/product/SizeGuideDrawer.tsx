import React, { useState } from 'react';
import './SizeGuideDrawer.css';

interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

const SIZE_CHART = [
  { size: '3', usa: '3', diameter: '14.1', circumference: '44.2' },
  { size: '3.5', usa: '3.5', diameter: '14.5', circumference: '45.5' },
  { size: '4', usa: '4', diameter: '14.9', circumference: '46.8' },
  { size: '4.5', usa: '4.5', diameter: '15.3', circumference: '48.0' },
  { size: '5', usa: '5', diameter: '15.7', circumference: '49.3' },
  { size: '5.5', usa: '5.5', diameter: '16.1', circumference: '50.6' },
  { size: '6', usa: '6', diameter: '16.5', circumference: '51.9' },
  { size: '6.5', usa: '6.5', diameter: '16.9', circumference: '53.1' },
  { size: '7', usa: '7', diameter: '17.3', circumference: '54.4' },
  { size: '7.5', usa: '7.5', diameter: '17.7', circumference: '55.7' },
  { size: '8', usa: '8', diameter: '18.1', circumference: '57.0' },
];

const SizeGuideDrawer: React.FC<SizeGuideDrawerProps> = ({
  isOpen,
  onClose,
  availableSizes,
  selectedSize,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'guide'>('select');

  if (!isOpen) return null;

  return (
    <>
      <div className="size-drawer-overlay" onClick={onClose} />
      <div className={`size-drawer ${isOpen ? 'open' : ''}`}>
        <div className="size-drawer__header">
          <button className="size-drawer__close" onClick={onClose}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="size-drawer__tabs">
          <button
            className={`size-drawer__tab ${activeTab === 'select' ? 'active' : ''}`}
            onClick={() => setActiveTab('select')}
          >
            Chọn size của bạn
          </button>
          <button
            className={`size-drawer__tab ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            Hướng dẫn đo size
          </button>
        </div>

        <div className="size-drawer__content">
          {activeTab === 'select' ? (
            <div className="size-drawer__select">
              <div className="size-table-header">
                <div>SIZE</div>
                <div>SIZE MỸ (US)</div>
                <div>ĐƯỜNG KÍNH (MM)</div>
                <div>CHU VI (MM)</div>
              </div>
              <div className="size-table-body">
                {SIZE_CHART.map((row) => {
                  const isAvailable = availableSizes.includes(row.size);
                  const isSelected = selectedSize === row.size;

                  return (
                    <div
                      key={row.size}
                      className={`size-table-row ${!isAvailable ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => isAvailable && onSelectSize(row.size)}
                    >
                      <div>{row.size}</div>
                      <div>{row.usa}</div>
                      <div>{row.diameter}</div>
                      <div className="size-select-col">
                        <span>{row.circumference}</span>
                        {isAvailable ? (
                          <div className={`radio-circle ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <div className="inner-dot" />}
                          </div>
                        ) : (
                          <span className="notify-me">Báo khi có hàng</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="size-drawer__guide">
              <h2 className="guide-title">Hướng dẫn đo size nhẫn</h2>
              
              <div className="guide-section">
                <h3>Đo ngón tay của bạn</h3>
                <div className="guide-image-container">
                  <svg viewBox="0 0 400 300" className="guide-illustration">
                    <rect width="100%" height="100%" fill="#f7f7f7" />
                    <path d="M170 170 Q 150 150 130 140" fill="none" stroke="#333" strokeWidth="2" />
                    <path d="M180 180 Q 220 220 260 270" fill="none" stroke="#333" strokeWidth="2" />
                    <path d="M190 150 Q 210 130 230 100" fill="none" stroke="#333" strokeWidth="2" />
                    <path d="M210 160 Q 230 140 260 110" fill="none" stroke="#333" strokeWidth="2" />
                    <circle cx="180" cy="165" r="5" fill="#333" />
                  </svg>
                </div>
                <ol className="guide-list">
                  <li>Sử dụng thước dây mềm hoặc một đoạn dây nhỏ.</li>
                  <li>Quấn quanh ngón tay bạn muốn đeo nhẫn, tại vị trí nhẫn sẽ khít nhất. Nếu dùng dây, đánh dấu điểm hai đầu gặp nhau bằng bút.</li>
                  <li>Đặt đoạn dây đã đánh dấu lên mặt phẳng và dùng thước thẳng để đo chiều dài (tính bằng mm). So sánh với bảng size của Velmora. Nếu số đo nằm giữa 2 size, hãy chọn size lớn hơn.</li>
                </ol>
              </div>

              <div className="guide-section">
                <h3>Đo nhẫn có sẵn</h3>
                <div className="guide-image-container">
                  <svg viewBox="0 0 400 300" className="guide-illustration">
                    <rect width="100%" height="100%" fill="#f7f7f7" />
                    <circle cx="200" cy="170" r="60" fill="none" stroke="#333" strokeWidth="4" />
                    <circle cx="200" cy="170" r="50" fill="none" stroke="#333" strokeWidth="2" />
                    <path d="M160 170 L240 170" fill="none" stroke="#333" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
                    <path d="M170 100 L200 60 L230 100 Z" fill="none" stroke="#333" strokeWidth="3" />
                    <line x1="185" y1="100" x2="200" y2="60" stroke="#333" strokeWidth="2" />
                    <line x1="215" y1="100" x2="200" y2="60" stroke="#333" strokeWidth="2" />
                    <defs>
                      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0 0 L6 3 L0 6 Z" fill="#333" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <ol className="guide-list">
                  <li>Chọn một chiếc nhẫn mà bạn đang đeo vừa vặn.</li>
                  <li>Đo đường kính bên trong của chiếc nhẫn bằng thước kẻ (mm).</li>
                  <li>Sử dụng bảng kích thước để đối chiếu size nhẫn của bạn với size Velmora gần nhất tính bằng mm.</li>
                </ol>
              </div>

              <div className="guide-footer">
                <h3>Dịch Vụ Chăm Sóc Khách Hàng VELMORA</h3>
                <p>Không có câu hỏi nào là quá nhỏ hay yêu cầu nào là quá lớn đối với các chuyên viên tư vấn của Velmora. Từ việc chọn nhẫn đính hôn, quà tặng đến việc đặt lịch hẹn tại cửa hàng hay trực tuyến, chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SizeGuideDrawer;
