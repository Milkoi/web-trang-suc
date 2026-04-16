import React, { useState } from "react";
import {
  ChevronDown,
  Truck,
  RotateCcw,
  CreditCard,
  Target,
  ArrowLeft,
  Gem,
  ShieldCheck,
  RefreshCw,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FAQPage.css";

const faqData = [
  {
    id: 1,
    category: "delivery",
    question: "Mua Online có ưu đãi gì đặc biệt cho tôi?",
    answer: "Velmora mang đến nhiều trải nghiệm mua sắm hiện đại khi mua Online:\n- Ưu đãi độc quyền Online với hình thức thanh toán đa dạng.\n- Đặt giữ hàng Online, nhận tại cửa hàng.\n- Miễn phí giao hàng từ 1-7 ngày trên toàn quốc và giao hàng trong 3 giờ tại một số khu vực trung tâm với các sản phẩm có gắn nhãn.\n- Trả góp 0% lãi suất với đơn hàng từ 3 triệu.\n- Làm sạch trang sức trọn đời, khắc tên miễn phí theo yêu cầu (tùy kết cấu sản phẩm) và chính sách bảo hành, đổi trả dễ dàng tại hệ thống Velmora trên toàn quốc.\nVelmora hân hạnh phục vụ quý khách qua Hotline 1900 520 131 (08:00-21:00, miễn phí cuộc gọi).",
  },
  {
    id: 2,
    category: "policy",
    question: "Velmora có thu mua lại trang sức không?",
    answer: "Dịch vụ thu đổi trang sức Velmora được áp dụng tại hệ thống cửa hàng trên toàn quốc (Trừ các dòng sản phẩm Bạc, Hợp kim cao cấp, Đồng hồ, Bao lì xì phong thủy, Chuỗi đá ngọc trai nước ngọt không gắn khóa vàng/chi tiết vàng). Chi tiết xem tại website hoặc liên hệ Hotline để được tư vấn chính xác nhất.",
  },
  {
    id: 3,
    category: "delivery",
    question: "Nếu đặt mua Online mà sản phẩm không đeo vừa thì có được đổi không?",
    answer: "Velmora có chính sách thu đổi trang sức vàng và đổi ni/size trang sức bạc trong vòng 48 giờ. Quý khách sẽ được áp dụng đổi tại hệ thống Velmora trên toàn quốc nếu sản phẩm đáp ứng điều kiện còn nguyên vẹn và đầy đủ hóa đơn.",
  },
  {
    id: 4,
    category: "care",
    question: "Sản phẩm đeo lâu có xỉn màu không, bảo hành như thế nào?",
    answer: "Do tính chất hóa học, sản phẩm có khả năng oxy hóa, xuống màu. Velmora có chính sách bảo hành miễn phí về lỗi kỹ thuật, nước xi:\n- Trang sức vàng: 6 tháng.\n- Trang sức bạc: 3 tháng.\nNgoài ra, Velmora cũng cung cấp dịch vụ siêu âm làm sạch bằng máy chuyên dụng (siêu âm, xi) miễn phí trọn đời tại hệ thống cửa hàng.",
  },
  {
    id: 5,
    category: "delivery",
    question: "Tôi muốn xem trực tiếp, cửa hàng nào còn hàng?",
    answer: "Với hệ thống cửa hàng trải rộng khắp toàn quốc, quý khách vui lòng liên hệ Hotline 1900 520 131 (08:00-21:00, miễn phí cuộc gọi) để kiểm tra cửa hàng còn hàng và tư vấn chương trình khuyến mãi Online trước khi đến cửa hàng.",
  },
  {
    id: 6,
    category: "care",
    question: "Làm thế nào để bảo quản trang sức bền đẹp?",
    answer: "Nên tránh để trang sức tiếp xúc trực tiếp với hóa chất, nước hoa. Khi không sử dụng, hãy cất vào hộp nhung chuyên dụng. Velmora cung cấp dịch vụ làm sạch và đánh bóng miễn phí trọn đời cho tất cả sản phẩm chính hãng.",
  },
];

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "Tất cả", icon: <Target className="w-5 h-5" /> },
    { id: "delivery", name: "Giao hàng", icon: <Truck className="w-5 h-5" /> },
    { id: "policy", name: "Chính sách", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "payment", name: "Thanh toán", icon: <CreditCard className="w-5 h-5" /> },
    { id: "care", name: "Bảo hành & Bảo quản", icon: <RefreshCw className="w-5 h-5" /> },
  ];

  const filteredFaqs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <div className="faq-page page-content bg-slate-50 min-h-screen pt-20 pb-20">
      <div className="faq-container px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-amber-700 transition-colors mb-6 mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </button>
          <h1 className="text-4xl font-serif text-slate-900 mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-slate-600">Chúng tôi luôn sẵn sàng giải đáp thắc mắc của bạn</p>
        </div>

        {/* Category Filters */}
        <div className="faq-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`faq-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id}
              className={`faq-item ${expandedId === faq.id ? "expanded" : ""}`}
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="faq-item__header"
              >
                <span className="faq-item__question">{faq.question}</span>
                <ChevronDown className="faq-item__icon w-5 h-5" />
              </button>
              
              <div className="faq-item__content">
                <div className="faq-item__answer">
                  {faq.answer.split('\n').map((line, i) => (
                    <p key={i} style={{ marginBottom: i === 0 ? '12px' : '6px' }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info box */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-md border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <Gem className="w-8 h-8 text-blue-700" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-medium text-slate-900 mb-2">Bạn cần thêm sự hỗ trợ?</h3>
            <p className="text-slate-600">Hãy liên hệ với chúng tôi qua các kênh hỗ trợ chính thức để được tư vấn nhanh nhất.</p>
          </div>
          <div className="flex-shrink-0">
             <button className="btn-primary py-3 px-8">Liên hệ ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
