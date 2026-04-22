import React, { useState } from 'react';
import './SizeGuideDrawer.css';

interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

const SIZE_CHARTS: Record<string, any[]> = {
  ring: [
    { size: '8', diameter: '15.3', circumference: '48.0' },
    { size: '9', diameter: '15.7', circumference: '49.3' },
    { size: '10', diameter: '16.1', circumference: '50.6' },
    { size: '11', diameter: '16.5', circumference: '51.9' },
    { size: '12', diameter: '16.9', circumference: '53.1' },
    { size: '13', diameter: '17.3', circumference: '54.4' },
    { size: '14', diameter: '17.7', circumference: '55.7' },
  ],
  necklace: [
    { size: '36', length: '36cm', desc: 'Sát cổ' },
    { size: '40', length: '40cm', desc: 'Vừa vặn' },
    { size: '42', length: '42cm', desc: 'Tiêu chuẩn' },
    { size: '45', length: '45cm', desc: 'Dài vừa' },
  ],
  bracelet: [
    { size: '14', length: '14cm', desc: 'Nhỏ' },
    { size: '15', length: '15cm', desc: 'Vừa' },
    { size: '16', length: '16cm', desc: 'Lớn' },
  ],
  anklet: [
    { size: '20', length: '20cm', desc: 'Nhỏ' },
    { size: '22', length: '22cm', desc: 'Vừa' },
    { size: '24', length: '24cm', desc: 'Lớn' },
  ]
};

const GUIDE_DATA: Record<string, any> = {
  ring: {
    title: "Cách đo size nhẫn",
    image: "/src/assets/anh/guide-ring-1.png",
    calculator: {
      label: "Kết quả bạn đo được là:",
      options: ["4.6", "4.7", "4.9", "5.1", "5.3"],
      unit: "cm"
    }
  },
  necklace: {
    title: "Cách đo size dây cổ",
    image: "/src/assets/anh/guide-necklace.png",
    calculator: {
      label: "Kết quả bạn đo được là:",
      options: ["36", "40", "42", "45"],
      unit: "cm"
    }
  },
  bracelet: {
    title: "Cách đo size lắc",
    image: "/src/assets/anh/guide-bracelet.png",
    calculator: {
      label: "Kết quả bạn đo được là:",
      options: ["14", "15", "16", "17"],
      unit: "cm"
    }
  },
  anklet: {
    title: "Cách đo size lắc chân",
    image: "/src/assets/anh/guide-bracelet.png",
    calculator: {
      label: "Kết quả bạn đo được là:",
      options: ["20", "22", "24"],
      unit: "cm"
    }
  }
};

const SizeGuideDrawer: React.FC<SizeGuideDrawerProps> = ({
  isOpen,
  onClose,
  category,
  availableSizes,
  selectedSize,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'guide'>('select');
  const [calcValue, setCalcValue] = useState<string>('');

  if (!isOpen) return null;

  const chartData = SIZE_CHARTS[category] || SIZE_CHARTS['ring'];
  const guideData = GUIDE_DATA[category] || GUIDE_DATA['ring'];

  return (
    <>
      <div className={`size-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
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
            Bảng size
          </button>
          <button
            className={`size-drawer__tab ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            Hướng dẫn đo
          </button>
        </div>

        <div className="size-drawer__content">
          {activeTab === 'select' ? (
            <div className="size-drawer__select">
              <h2 className="guide-title">{guideData.title}</h2>
              <div className="size-table-header">
                <div>SIZE</div>
                {category === 'ring' ? (
                  <>
                    <div>ĐƯỜNG KÍNH</div>
                    <div>CHU VI</div>
                  </>
                ) : (
                  <div>CHIỀU DÀI</div>
                )}
                <div>CHỌN</div>
              </div>
              <div className="size-table-body">
                {chartData.map((row) => {
                  const isAvailable = availableSizes.includes(row.size);
                  const isSelected = selectedSize === row.size;

                  return (
                    <div
                      key={row.size}
                      className={`size-table-row ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                      onClick={() => isAvailable && onSelectSize(row.size)}
                    >
                      <div className="size-cell-bold">{row.size}</div>
                      {category === 'ring' ? (
                        <>
                          <div>{row.diameter}mm</div>
                          <div>{row.circumference}mm</div>
                        </>
                      ) : (
                        <div>{row.length}</div>
                      )}
                      <div className="size-select-col">
                        <div className={`radio-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <div className="inner-dot" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!availableSizes.length && (
                <p className="size-guide-note">Vui lòng kiểm tra lại sự hiện diện của các size trong kho.</p>
              )}
            </div>
          ) : (
            <div className="size-drawer__guide">
              <h2 className="guide-title">{guideData.title}</h2>
              
              <div className="full-guide-image-container">
                <img src={guideData.image} alt={guideData.title} className="full-guide-image" />
              </div>

              <div className="guide-calculator">
                <h3 className="calc-title">{guideData.calculator.label}</h3>
                <div className="calc-options">
                  {guideData.calculator.options.map((opt: string) => (
                    <label key={opt} className={`calc-option-label ${calcValue === opt ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="guide-calc" 
                        value={opt} 
                        checked={calcValue === opt}
                        onChange={(e) => setCalcValue(e.target.value)}
                      />
                      <span>{opt} {guideData.calculator.unit}</span>
                    </label>
                  ))}
                </div>
                {calcValue && (
                  <div className="calc-result-box">
                    <p>Size tương ứng của bạn là:</p>
                    <span className="result-size-badge">{calcValue}</span>
                    <button 
                      className="btn-apply-size"
                      onClick={() => {
                         onSelectSize(calcValue);
                         setActiveTab('select');
                      }}
                    >
                      Chọn size này
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default SizeGuideDrawer;
