import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Tiffany Knot Ring',
    price: 145000000,
    originalPrice: 150000000,
    category: 'ring',
    material: 'gold', 
    images: [
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-knotring-68886364_1020084_ED_M.jpg',
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-knotring-68886364_1020085_AV_1.jpg'
    ],
    description: 'Nhẫn đính kim cương với thiết kế nút thắt tượng trưng cho sự gắn kết vĩnh cửu.',
    originStory: 'Khơi nguồn cảm hứng từ kiến trúc và nhịp sống của thành phố New York, bộ sưu tập Tiffany Knot đại diện cho những sợi dây gắn kết không thể đứt lìa trong cuộc sống của chúng ta.',
    availableSizes: ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8'],
    inStock: true,
    isNew: true,
    isSale: true,
    rating: 4.9,
    reviews: 128,
    sku: 'TIF-KNOT-WG'
  },
  {
    id: 2,
    name: 'Tiffany Lock Bangle',
    price: 190000000,
    category: 'bracelet',
    material: 'gold',
    images: [
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-lockbangle-70180422_1052959_ED.jpg',
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-lockbangle-70180422_1052960_AV_1.jpg'
    ],
    description: 'Lắc tay Vàng hồng 18k mang mãnh lực tình yêu.',
    originStory: 'Biểu tượng của những mối liên kết tạo nên con người chúng ta, Tiffany Lock tựa như một biểu tượng hiện đại của tình yêu trọn đời. Lấy cảm hứng từ hoạ tiết ổ khoá kinh điển từ kho lưu trữ của thương hiệu từ thập niên 1880.',
    availableSizes: ['Small', 'Medium', 'Large'],
    inStock: true,
    isNew: false,
    isSale: false,
    rating: 4.8,
    reviews: 94,
    sku: 'TIF-LOCK-RG'
  },
  {
    id: 3,
    name: 'Tiffany T Smile Pendant',
    price: 25000000,
    category: 'necklace',
    material: 'gold',
    images: [
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-t-smilependant-62617659_997784_ED_M.jpg',
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-t-smilependant-62617659_997785_AV_1.jpg'
    ],
    description: 'Dây chuyền vàng mang nụ cười tinh tế.',
    originStory: 'Bộ sưu tập Tiffany T mang đậm dấu ấn kiến trúc với đường nét thanh mảnh, sắc nét. Hình mặt cười tượng trưng cho niềm vui và sự lạc quan không bao giờ vụt tắt.',
    availableSizes: ['16"', '18"', '20"'],
    inStock: true,
    isNew: false,
    isSale: false,
    rating: 5.0,
    reviews: 231,
    sku: 'TIF-SMILE-YG'
  },
  {
    id: 4,
    name: 'Elsa Peretti® Diamonds by the Yard® Earrings',
    price: 42000000,
    originalPrice: 48000000,
    category: 'earring',
    material: 'diamond',
    images: [
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/elsa-perettidiamonds-by-the-yardearrings-12818653_936173_ED.jpg',
      'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/elsa-perettidiamonds-by-the-yardearrings-12818653_936174_AV_1.jpg'
    ],
    description: 'Bông tai kim cương mang vẻ đẹp rực rỡ và thuần khiết.',
    originStory: 'Nhà thiết kế huyền thoại Elsa Peretti đã thực hiện một cuộc cách mạng trong lĩnh vực trang sức, biến viên kim cương quý giá trở nên gần gũi với phong cách hằng ngày, toả sáng rạng rỡ từ mọi góc nhìn.',
    availableSizes: ['One Size'],
    inStock: true,
    isNew: true,
    isSale: true,
    rating: 4.7,
    reviews: 56,
    sku: 'TIF-ELSA-PT'
  }
];

export const categories = [
  { id: 'necklace', label: 'Dây Chuyền', icon: '📿' },
  { id: 'ring', label: 'Nhẫn', icon: '💍' },
  { id: 'bracelet', label: 'Lắc Tay', icon: '✨' },
  { id: 'anklet', label: 'Lắc Chân', icon: '🦋' },
  { id: 'earring', label: 'Bông Tai', icon: '💎' },
];

export const materials = [
  { id: 'gold', label: 'Vàng' },
  { id: 'silver', label: 'Bạc' },
  { id: 'platinum', label: 'Bạch Kim' },
  { id: 'diamond', label: 'Kim Cương' },
];
