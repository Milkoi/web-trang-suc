-- phpMyAdmin SQL Dump
-- Database Schema cho VELMORA (Khớp 100% camelCase với Frontend)
-- Phiên bản Đồng bộ với database_design_new.md

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Đảm bảo xóa bảng cũ rườm rà trước khi tạo thiết kế mới
DROP TABLE IF EXISTS `favorites`, `order_items`, `orders`, `product_images`, `product_variants`, `products`, `materials`, `categories`, `users`;
DROP TABLE IF EXISTS `wishlist`, `reviews`, `promotions`, `news`, `faqs`, `cart_items`, `carts`, `services`, `suppliers`, `PRODUCT_SIZES`, `shop_settings`;

-- --------------------------------------------------------

-- Bảng 1: users (Người dùng) - camelCase
CREATE TABLE `users` (
  `id` char(36) NOT NULL COMMENT 'UUID (char 36)',
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `role` varchar(50) DEFAULT 'customer',
  `provider` varchar(50) DEFAULT 'email' COMMENT 'email / google',
  `phone` varchar(20) DEFAULT NULL,
  `defaultAddress` text DEFAULT NULL,
  `newsletterOptin` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 2: categories (Danh mục) - camelCase
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imageUrl` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 3: materials (Chất liệu) - camelCase
CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 4: products (Sản phẩm) - camelCase
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sku` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `materialId` int(11) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `originalPrice` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `originStory` text DEFAULT NULL,
  `stockQuantity` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `reviewCount` int(11) DEFAULT 0,
  `isNew` tinyint(1) DEFAULT 0,
  `isSale` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku_unique` (`sku`),
  KEY `fk_products_category` (`categoryId`),
  KEY `fk_products_material` (`materialId`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_material` FOREIGN KEY (`materialId`) REFERENCES `materials` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 5: product_variants (Biến thể sản phẩm) - camelCase
CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `productId` bigint(20) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `originalPrice` decimal(15,2) DEFAULT NULL,
  `stockQuantity` int(11) DEFAULT 0,
  `isSale` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku_unique` (`sku`),
  KEY `fk_variants_product` (`productId`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 6: product_images (Hình ảnh Gallery) - camelCase
CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `productId` bigint(20) NOT NULL,
  `url` text NOT NULL,
  `isMain` tinyint(1) DEFAULT 0,
  `displayOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_images_product` (`productId`),
  CONSTRAINT `fk_images_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 7: orders (Đơn hàng) - camelCase
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL COMMENT 'Mã đơn dạng ORD-XXXX',
  `userId` char(36) DEFAULT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `apartment` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `postalCode` varchar(20) DEFAULT NULL,
  `shippingMethod` varchar(50) NOT NULL,
  `shippingFee` decimal(15,2) DEFAULT 0.00,
  `paymentMethod` varchar(50) NOT NULL,
  `paymentStatus` varchar(50) DEFAULT 'unpaid',
  `orderStatus` varchar(50) DEFAULT 'pending',
  `discountCode` varchar(50) DEFAULT NULL,
  `discountAmount` decimal(15,2) DEFAULT 0.00,
  `totalAmount` decimal(15,2) NOT NULL,
  `estimatedDelivery` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `paidAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`userId`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 8: order_items (Chi tiết đơn hàng) - camelCase
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(50) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `variantId` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `priceAtPurchase` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_items_order` (`orderId`),
  KEY `fk_items_product` (`productId`),
  KEY `fk_items_variant` (`variantId`),
  CONSTRAINT `fk_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_variant` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 9: favorites (Yêu thích) - camelCase
CREATE TABLE `favorites` (
  `userId` char(36) NOT NULL,
  `productId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`productId`),
  KEY `fk_favorites_product` (`productId`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorites_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 10: reviews (Đánh giá)
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `fk_reviews_product` (`product_id`),
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 11: shop_settings (Cấu hình liên hệ) - camelCase
CREATE TABLE `shop_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `workingHours` varchar(255) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 12: banners (Banner quảng cáo)
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imageUrl` text NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 13: carts (Giỏ hàng)
CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` char(36) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_carts_user` (`userId`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 14: cart_items (Chi tiết giỏ hàng)
CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cartId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `variantId` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cartitems_cart` (`cartId`),
  KEY `fk_cartitems_product` (`productId`),
  CONSTRAINT `fk_cartitems_cart` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitems_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 15: wishlist (Danh sách mong muốn)
CREATE TABLE `wishlist` (
  `userId` char(36) NOT NULL,
  `productId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`productId`),
  KEY `fk_wishlist_product` (`productId`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Bảng 16: services & suppliers & promotions (Bảng trống để tránh lỗi EF Core)
CREATE TABLE `services` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255), PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `suppliers` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255), PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `promotions` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255), `discount` int, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- DỮ LIỆU MẪU (MOCK DATA TỪ FRONTEND)
-- ========================================================

-- Chèn dữ liệu Danh mục (Categories) với ImageUrl thật
INSERT INTO `categories` (`id`, `slug`, `name`, `imageUrl`, `description`) VALUES
(1, 'necklace', 'Dây Chuyền', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', 'Những mẫu dây chuyền tinh tế, tôn vinh vẻ đẹp vùng cổ.'),
(2, 'ring', 'Nhẫn', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', 'Biểu tượng của tình yêu và sự cam kết vĩnh cửu.'),
(3, 'bracelet', 'Lắc Tay', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'Điểm nhấn sang trọng cho đôi tay phái đẹp.'),
(4, 'anklet', 'Lắc Chân', 'https://images.unsplash.com/photo-1535633302704-b04049b39862?w=800&q=80', 'Sự nhẹ nhàng, duyên dáng trong từng bước chân.'),
(5, 'earring', 'Bông Tai', 'https://images.unsplash.com/photo-1535633302704-b04049b39862?w=800&q=80', 'Lấp lánh và rạng rỡ, làm nổi bật khuôn mặt.');

-- Chèn dữ liệu Chất liệu (Materials)
INSERT INTO `materials` (`id`, `slug`, `name`) VALUES
(1, 'gold', 'Vàng'),
(2, 'silver', 'Bạc'),
(3, 'platinum', 'Bạch Kim'),
(4, 'diamond', 'Kim Cương');

-- Chèn dữ liệu Sản phẩm (Products)
INSERT INTO `products` (`id`, `sku`, `name`, `categoryId`, `materialId`, `price`, `originalPrice`, `description`, `originStory`, `stockQuantity`, `rating`, `reviewCount`, `isNew`, `isSale`) VALUES
(1, 'TIF-KNOT-WG', 'Tiffany Knot Ring', 2, 1, 145000000.00, 150000000.00, 'Nhẫn đính kim cương với thiết kế nút thắt tượng trưng cho sự gắn kết vĩnh cửu.', 'Lấy cảm hứng từ những nút thắt trong cuộc sống, tượng trưng cho sự kết nối không thể tách rời.', 108, 4.9, 128, 1, 1),
(2, 'TIF-LOCK-RG', 'Tiffany Lock Bangle', 3, 1, 190000000.00, NULL, 'Lắc tay Vàng hồng 18k mang mãnh lực tình yêu.', 'Thiết kế ổ khóa đặc trưng, bảo vệ những gì quý giá nhất.', 32, 4.8, 94, 0, 0),
(3, 'TIF-SMILE-YG', 'Tiffany T Smile Pendant', 1, 1, 25000000.00, NULL, 'Dây chuyền vàng mang nụ cười tinh tế.', 'Một lời nhắc nhở về niềm vui và sự lạc quan mỗi ngày.', 45, 5.0, 231, 0, 0),
(4, 'TIF-ELSA-PT', 'Elsa Peretti® Diamonds by the Yard® Earrings', 5, 4, 42000000.00, 48000000.00, 'Bông tai kim cương mang vẻ đẹp rực rỡ và thuần khiết.', 'Thiết kế của Elsa Peretti, mang phong cách tối giản nhưng vô cùng sang trọng.', 20, 4.7, 56, 1, 1),
(5, 'VEL-DIA-NECK', 'Velmora Diamond Heart', 1, 4, 85000000.00, 95000000.00, 'Dây chuyền kim cương hình trái tim đại diện cho tình yêu nồng cháy.', 'Kiệt tác được chế tác thủ công trong 200 giờ bởi nghệ nhân Velmora.', 15, 4.9, 45, 1, 1);

-- Chèn dữ liệu Biến thể (Product Variants)
INSERT INTO `product_variants` (`id`, `productId`, `sku`, `size`, `price`, `originalPrice`, `stockQuantity`, `isSale`) VALUES
(101, 1, 'TIF-KNOT-WG-4', '4', 145000000.00, 150000000.00, 12, 1),
(102, 1, 'TIF-KNOT-WG-5', '5', 145000000.00, 150000000.00, 12, 1),
(201, 2, 'TIF-LOCK-RG-S', 'S', 190000000.00, NULL, 8, 0),
(301, 3, 'TIF-SMILE-YG-16', '16"', 25000000.00, NULL, 15, 0),
(401, 4, 'TIF-ELSA-PT-OS', 'One Size', 42000000.00, 48000000.00, 20, 1),
(501, 5, 'VEL-DIA-NECK-OS', 'One Size', 85000000.00, 95000000.00, 15, 1);

-- Chèn dữ liệu Hình ảnh (Product Images)
INSERT INTO `product_images` (`productId`, `url`, `isMain`, `displayOrder`) VALUES
(1, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-knotring-68886364_1020084_ED_M.jpg', 1, 1),
(1, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-knotring-68886364_1020085_AV_1.jpg', 0, 2),
(2, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-lockbangle-70180422_1052959_ED.jpg', 1, 1),
(2, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-lockbangle-70180422_1052960_AV_1.jpg', 0, 2),
(3, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-t-smilependant-62617659_997784_ED_M.jpg', 1, 1),
(4, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/elsa-perettidiamonds-by-the-yardearrings-12818653_936173_ED.jpg', 1, 1),
(5, 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-t-smilependant-62617659_997784_ED_M.jpg', 1, 1);

-- Chèn dữ liệu Thông tin cửa hàng (Shop Settings)
INSERT INTO `shop_settings` (`phone`, `email`, `workingHours`) VALUES
('1900 520 131', 'luxelum@gmail.com', 'T2-CN: 8:00 - 23:00');

-- Chèn dữ liệu banner mặc định
INSERT INTO `banners` (`imageUrl`, `subtitle`, `title`, `description`, `isActive`) VALUES
('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80', 
 'Bộ sưu tập mới 2025', 
 'Tinh Hoa\nTrang Sức Việt', 
 'Nơi hội tụ những kiệt tác từ bàn tay nghệ nhân lành nghề —\nSang trọng, tinh tế, vĩnh cửu.', 
 1);

ALTER TABLE cart_items ADD COLUMN size VARCHAR(50) DEFAULT NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
