-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thiết lập Database hệ thống Thương mại điện tử Trang Sức (Đầy đủ 15 bảng)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

SET FOREIGN_KEY_CHECKS = 0;

--
-- Cơ sở dữ liệu: `web_trang_suc_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `carts` (`id`, `user_id`) VALUES
(1, 1),
(2, 4),
(4, 5),
(3, 6),
(5, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1 CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `cart_items` (`id`, `cart_id`, `variant_id`, `quantity`) VALUES
(8, 3, 1, 1),
(9, 3, 4, 1),
(17, 2, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Nhẫn', 'Quý giá và vượt thời gian'),
(2, 'Dây chuyền', 'Tôn vinh vẻ đẹp sang trọng'),
(3, 'Lắc tay', 'Điểm nhấn cho nét thanh lịch'),
(4, 'Bông tai', 'Ánh sáng lấp lánh cuốn hút');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `faqs`
--

DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1 COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `faqs` (`id`, `question`, `answer`, `sort_order`, `status`, `created_at`) VALUES
(1, 'Chính sách bảo hành trang sức của cửa hàng như thế nào?', 'Bạn được hỗ trợ làm sáng miễn phí trọn đời và đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem mác.', 1, 1, '2026-04-06 11:06:30'),
(2, 'Làm sao để tôi chọn đúng size nhẫn?', 'Bạn có thể tham khảo bảng quy đổi kích cỡ chi tiết trong phần hướng dẫn đo size nhẫn (Size Guide) của chúng tôi.', 2, 1, '2026-04-06 11:06:30'),
(3, 'Cửa hàng có giao hàng toàn quốc không?', 'Chúng tôi hỗ trợ giao hàng tận nơi trên toàn quốc với hình thức bảo hiểm hàng hóa có giá trị cao.', 3, 1, '2026-04-06 11:06:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `publish_date` date NOT NULL,
  `img_url` text NOT NULL,
  `description` text NOT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `news` (`id`, `category`, `title`, `publish_date`, `img_url`, `description`, `content`, `created_at`) VALUES
(1, 'Editorial', 'Xu hướng Trang Sức Tối Giản nạp đầy năng lượng 2026', '2026-05-15', 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000', 'Khám phá cách chúng tôi kết hợp chất liệu truyền thống với kim cương hiện đại...', 'Nội dung chi tiết bài viết về xu hướng Trang Sức năm 2026.', '2026-04-05 06:20:49'),
(2, 'Sự kiện', 'Cửa hàng Trang sức cao cấp khai trương chi nhánh thứ 10 tại Hà Nội', '2026-05-10', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000', 'Sự kiện ra mắt bộ sưu tập hoàng gia đặc biệt đi kèm những ưu đãi độc quyền...', 'Thông tin chi tiết về buổi khai trương và danh sách quà tặng cao cấp.', '2026-04-05 06:20:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_code` varchar(255) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('Pending','Shipping','Success','Cancel') NOT NULL DEFAULT 'Pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `price_at_purchase` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand_text` varchar(50) DEFAULT 'Tiffany & Co.',
  `accent_color` varchar(50) DEFAULT 'bg-[#9bdc28]',
  `hover_accent` varchar(50) DEFAULT 'hover:bg-[#9bdc28]',
  `image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `origin_story` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products` (`id`, `name`, `brand_text`, `image_url`, `description`, `origin_story`, `category_id`, `supplier_id`) VALUES
(1, 'Tiffany Knot Ring', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000', 'Nhẫn White Gold đính kim cương với thiết kế nút thắt tượng trưng cho sự gắn kết vĩnh cửu.', 'Khơi nguồn cảm hứng từ kiến trúc và nhịp sống của thành phố New York, bộ sưu tập Tiffany Knot đại diện cho những sợi dây gắn kết không thể đứt lìa trong cuộc sống của chúng ta.', 1, 1),
(2, 'Tiffany Lock Bangle', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000', 'Lắc tay Vàng hồng 18k mang mãnh lực tình yêu.', 'Biểu tượng của những mối liên kết tạo nên con người chúng ta, Tiffany Lock tựa như một biểu tượng hiện đại của tình yêu trọn đời. Lấy cảm hứng từ hoạ tiết ổ khoá kinh điển từ thập niên 1880.', 3, 1),
(3, 'Tiffany T Smile Pendant', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000', 'Dây chuyền vàng mang nụ cười tinh tế.', 'Bộ sưu tập Tiffany T mang đậm dấu ấn kiến trúc với đường nét thanh mảnh, sắc nét. Hình mặt cười tượng trưng cho niềm vui và sự lạc quan không bao giờ vụt tắt.', 2, 2),
(4, 'Elsa Peretti® Diamonds by the Yard Earrings', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000', 'Bông tai kim cương mang vẻ đẹp rực rỡ và thuần khiết.', 'Nhà thiết kế huyền thoại Elsa Peretti đã thực hiện một cuộc cách mạng trong lĩnh vực trang sức, biến viên kim cương quý giá trở nên gần gũi với phong cách hằng ngày.', 4, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(10) NOT NULL,
  `color` varchar(30) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0 CHECK (`stock_quantity` >= 0),
  `sku` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `product_variants` (`id`, `product_id`, `size`, `color`, `price`, `stock_quantity`, `sku`) VALUES
(1, 1, '5', 'White Gold', 145000000.00, 10, 'TIF-KNOT-WG-5'),
(2, 1, '5.5', 'White Gold', 145000000.00, 15, 'TIF-KNOT-WG-5.5'),
(3, 1, '6', 'White Gold', 145000000.00, 20, 'TIF-KNOT-WG-6'),
(4, 2, 'Medium', 'Rose Gold', 190000000.00, 8, 'TIF-LOCK-RG-M'),
(5, 2, 'Large', 'Rose Gold', 190000000.00, 5, 'TIF-LOCK-RG-L'),
(6, 3, '16"', 'Yellow Gold', 25000000.00, 30, 'TIF-SMILE-YG-16'),
(7, 4, 'One Size', 'Platinum', 42000000.00, 12, 'TIF-ELSA-PT-OS');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL COMMENT 'Mã giảm giá (ví dụ: GiamGia10)',
  `description` varchar(255) DEFAULT NULL,
  `discount_value` decimal(15,2) NOT NULL COMMENT 'Giá trị giảm',
  `discount_type` enum('Percentage','FixedAmount') NOT NULL DEFAULT 'FixedAmount',
  `min_order_value` decimal(15,2) DEFAULT 0.00 COMMENT 'Giá trị đơn hàng tối thiểu để áp dụng',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL COMMENT 'Số lần tối đa mã được sử dụng',
  `used_count` int(11) DEFAULT 0 COMMENT 'Số lần đã sử dụng',
  `status` tinyint(1) DEFAULT 1 COMMENT '1: Hoạt động, 0: Ngưng áp dụng',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotions` (`id`, `code`, `description`, `discount_value`, `discount_type`, `min_order_value`, `start_date`, `end_date`, `usage_limit`, `used_count`, `status`, `created_at`) VALUES
(1, 'WELCOME2026', 'Giảm 500k cho đơn hàng trang sức đầu tiên', 500000.00, 'FixedAmount', 10000000.00, '2026-01-01', '2026-12-31', 1000, 0, 1, '2026-04-05 06:20:49'),
(2, 'LUXURY10', 'Giảm 10% cho bộ sưu tập kim cương', 10.00, 'Percentage', 0.00, '2026-04-01', '2026-06-30', 500, 0, 1, '2026-04-05 06:20:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` tinyint(1) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 1, 5, 'Nhẫn sáng rực rỡ, thiết kế cực kỳ tinh tế và đẳng cấp!', '2026-04-05 06:20:49'),
(2, 3, 2, 4, 'Đeo rất sang trọng, tuy nhiên chốt khóa hơi khó cài một chút khi tự đeo.', '2026-04-05 06:20:49'),
(3, 1, 3, 5, 'Dây chuyền vàng sáng bóng, nét chữ T tinh xảo.', '2026-04-08 02:50:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `icon_name` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `order_index` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `services` (`id`, `icon_name`, `title`, `description`, `order_index`) VALUES
(1, 'Truck', 'Giao hàng bảo mật', 'Dịch vụ vận chuyển chuyên biệt dành cho hàng hóa giá trị cao', 1),
(2, 'ShieldCheck', 'Chính hãng 100%', 'Bảo hiểm và giấy chứng nhận đá quý kèm theo mỗi sản phẩm', 2),
(3, 'RefreshCw', 'Làm sáng trọn đời', 'Dịch vụ bảo dưỡng và làm sáng trang sức tại cửa hàng', 3),
(4, 'CreditCard', 'Thanh toán linh hoạt', 'Hỗ trợ thanh toán thẻ tín dụng và chuyển khoản an toàn', 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suppliers` (`id`, `name`, `phone`, `address`) VALUES
(1, 'Tiffany & Co. US', '1800123456', 'New York, Hoa Kỳ'),
(2, 'Trí Việt Jewelry', '0987654321', 'Quận 1, TP. Hồ Chí Minh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('Admin','Staff','Customer') NOT NULL DEFAULT 'Customer',
  `auth_provider` enum('local','google') DEFAULT 'local',
  `google_id` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1 COMMENT '1: Hoạt động, 0: Khóa',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `login_ip` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_variant_id` int(11) NOT NULL COMMENT 'Liên kết với biến thể cụ thể để biết Size và Color',
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wishlist` (`id`, `user_id`, `product_variant_id`, `added_at`) VALUES
(1, 3, 1, '2026-04-06 11:06:14');

-- --------------------------------------------------------

--
-- Chỉ mục cho các bảng đã đổ
--

-- Chỉ mục cho bảng `carts`
ALTER TABLE `carts` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id` (`user_id`);
-- Chỉ mục cho bảng `cart_items`
ALTER TABLE `cart_items` ADD PRIMARY KEY (`id`), ADD KEY `fk_items_cart` (`cart_id`), ADD KEY `fk_items_variant` (`variant_id`);
-- Chỉ mục cho bảng `categories`
ALTER TABLE `categories` ADD PRIMARY KEY (`id`);
-- Chỉ mục cho bảng `faqs`
ALTER TABLE `faqs` ADD PRIMARY KEY (`id`);
-- Chỉ mục cho bảng `news`
ALTER TABLE `news` ADD PRIMARY KEY (`id`);
-- Chỉ mục cho bảng `orders`
ALTER TABLE `orders` ADD PRIMARY KEY (`id`), ADD KEY `fk_orders_user` (`user_id`);
-- Chỉ mục cho bảng `order_items`
ALTER TABLE `order_items` ADD PRIMARY KEY (`id`), ADD KEY `fk_oi_order` (`order_id`), ADD KEY `fk_oi_variant` (`product_variant_id`);
-- Chỉ mục cho bảng `products`
ALTER TABLE `products` ADD PRIMARY KEY (`id`), ADD KEY `fk_products_category` (`category_id`), ADD KEY `fk_products_supplier` (`supplier_id`);
-- Chỉ mục cho bảng `product_variants`
ALTER TABLE `product_variants` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `sku` (`sku`), ADD KEY `fk_variants_product` (`product_id`);
-- Chỉ mục cho bảng `promotions`
ALTER TABLE `promotions` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `code` (`code`);
-- Chỉ mục cho bảng `reviews`
ALTER TABLE `reviews` ADD PRIMARY KEY (`id`), ADD KEY `fk_reviews_user` (`user_id`), ADD KEY `fk_reviews_product` (`product_id`);
-- Chỉ mục cho bảng `services`
ALTER TABLE `services` ADD PRIMARY KEY (`id`);
-- Chỉ mục cho bảng `suppliers`
ALTER TABLE `suppliers` ADD PRIMARY KEY (`id`);
-- Chỉ mục cho bảng `users`
ALTER TABLE `users` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`), ADD UNIQUE KEY `google_id` (`google_id`);
-- Chỉ mục cho bảng `wishlist`
ALTER TABLE `wishlist` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_wishlist_variant` (`user_id`,`product_variant_id`), ADD KEY `fk_wishlist_variant` (`product_variant_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

ALTER TABLE `carts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `cart_items` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
ALTER TABLE `categories` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `faqs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `news` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
ALTER TABLE `orders` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `order_items` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `products` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `product_variants` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `promotions` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `reviews` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `services` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `suppliers` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `wishlist` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

ALTER TABLE `carts` ADD CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `cart_items` ADD CONSTRAINT `fk_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE, ADD CONSTRAINT `fk_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
ALTER TABLE `order_items` ADD CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE, ADD CONSTRAINT `fk_oi_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);
ALTER TABLE `products` ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL, ADD CONSTRAINT `fk_products_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;
ALTER TABLE `product_variants` ADD CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE, ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `wishlist` ADD CONSTRAINT `fk_wishlist_user_new` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE, ADD CONSTRAINT `fk_wishlist_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
