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
                <div>ĐƯỜNG KÍNH (MM)</div>
                <div>CHU VI (MM)</div>
              </div>
              <div className="size-table-body">
                {SIZE_CHART.filter(row => ['14.7mm', '17.5mm', '20mm'].includes(row.size)).map((row) => {
                  const isSelected = selectedSize === row.size;

                  return (
                    <div
                      key={row.size}
                      className={`size-table-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectSize(row.size)}
                    >
                      <div>{row.size}</div>
                      <div>{row.diameter}</div>
                      <div className="size-select-col">
                        <span>{row.circumference}</span>
                        <div className={`radio-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <div className="inner-dot" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="size-drawer__guide">
              <h3>Hướng dẫn đo size nhẫn</h3>
              <p>Đo ngón tay của bạn</p>
              <img src="/path/to/image3.png" alt="Hướng dẫn đo size nhẫn" />
              <p>
                Sử dụng thước dây mềm hoặc một đoạn dây nhỏ. Quấn quanh ngón tay bạn muốn đeo nhẫn, tại vị trí nhẫn sẽ khít nhất. Nếu dùng dây, đánh dấu điểm hai đầu gặp nhau bằng bút. Đặt đoạn dây đã đánh dấu lên mặt phẳng và dùng thước thẳng để đo chiều dài (tính bằng mm). So sánh với bảng size của Velmora. Nếu số đo nằm giữa 2 size, hãy chọn size lớn hơn.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SizeGuideDrawer;
