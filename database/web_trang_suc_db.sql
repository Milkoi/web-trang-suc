-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 19, 2026 lúc 11:38 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `web_trang_suc_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `imageUrl` text NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `imageUrl`, `subtitle`, `title`, `description`, `isActive`) VALUES
(1, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80', 'Bộ sưu tập mới 2026', 'Tinh Hoa\r\nTrang Sức Việt', 'Nơi hội tụ những kiệt tác từ bàn tay nghệ nhân lành nghề —\r\nSang trọng, tinh tế, vĩnh cửu.', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL,
  `userId` char(36) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `carts`
--

INSERT INTO `carts` (`id`, `userId`, `createdAt`) VALUES
(4, 'admin-uuid-001', '2026-04-18 15:49:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `cartId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `variantId` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `cartId`, `productId`, `variantId`, `quantity`, `size`) VALUES
(25, 4, 1, 589, 1, '7'),
(26, 4, 2, 201, 1, 'S');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imageUrl` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `slug`, `name`, `imageUrl`, `description`, `createdAt`) VALUES
(1, 'necklace', 'Dây Chuyền', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', 'Những mẫu dây chuyền tinh tế, tôn vinh vẻ đẹp vùng cổ.', '2026-04-16 19:05:28'),
(2, 'ring', 'Nhẫn', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', 'Biểu tượng của tình yêu và sự cam kết vĩnh cửu.', '2026-04-16 19:05:28'),
(3, 'bracelet', 'Lắc Tay', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'Điểm nhấn sang trọng cho đôi tay phái đẹp.', '2026-04-16 19:05:28'),
(4, 'anklet', 'Lắc Chân', 'https://images.unsplash.com/photo-1535633302704-b04049b39862?w=800&q=80', 'Sự nhẹ nhàng, duyên dáng trong từng bước chân.', '2026-04-16 19:05:28'),
(5, 'earring', 'Bông Tai', 'https://images.unsplash.com/photo-1535633302704-b04049b39862?w=800&q=80', 'Lấp lánh và rạng rỡ, làm nổi bật khuôn mặt.', '2026-04-16 19:05:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `userId` char(36) NOT NULL,
  `productId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `favorites`
--

INSERT INTO `favorites` (`userId`, `productId`) VALUES
('admin-uuid-001', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `materials`
--

INSERT INTO `materials` (`id`, `slug`, `name`) VALUES
(1, 'gold', 'Vàng'),
(2, 'silver', 'Bạc'),
(3, 'platinum', 'Vàng giả'),
(4, 'diamond', 'Kim Cương');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

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
  `paidAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `orderId` varchar(50) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `variantId` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `priceAtPurchase` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `categoryId`, `materialId`, `price`, `originalPrice`, `description`, `originStory`, `stockQuantity`, `rating`, `reviewCount`, `isNew`, `isSale`, `createdAt`) VALUES
(1, 'TIF-KNOT-WG', 'Tiffany Knot Ring', 2, 1, 145000000.00, 150000000.00, 'Nhẫn đính kim cương với thiết kế nút thắt tượng trưng cho sự gắn kết vĩnh cửu.', '', 0, 4.90, 128, 1, 1, '2026-04-16 19:05:29'),
(2, 'TIF-LOCK-RG', 'Tiffany Lock Bangle', 3, 1, 190000000.00, 0.00, 'Lắc tay Vàng hồng 18k mang mãnh lực tình yêu.', '', 0, 4.80, 94, 0, 0, '2026-04-16 19:05:29'),
(3, 'TIF-SMILE-YG', 'Tiffany T Smile Pendant', 1, 1, 25000000.00, NULL, 'Dây chuyền vàng mang nụ cười tinh tế.', 'Một lời nhắc nhở về niềm vui và sự lạc quan mỗi ngày.', 45, 5.00, 231, 0, 0, '2026-04-16 19:05:29'),
(4, 'TIF-ELSA-PT', 'Elsa Peretti® Diamonds by the Yard® Earrings', 5, 4, 42000000.00, 48000000.00, 'Bông tai kim cương mang vẻ đẹp rực rỡ và thuần khiết.', 'Thiết kế của Elsa Peretti, mang phong cách tối giản nhưng vô cùng sang trọng.', 20, 4.70, 56, 1, 1, '2026-04-16 19:05:29'),
(5, 'VEL-DIA-NECK', 'Velmora Diamond Heart', 1, 4, 85000000.00, 95000000.00, 'Dây chuyền kim cương hình trái tim đại diện cho tình yêu nồng cháy.', 'Kiệt tác được chế tác thủ công trong 200 giờ bởi nghệ nhân Velmora.', 15, 4.90, 45, 1, 1, '2026-04-16 19:05:29'),
(15, 'tmn', 'TMN', 5, NULL, 1400000.00, 0.00, 'Lấp lánh trên từng đôi tai, cửa sổ tâm hồn của bạn sẽ mang cảm giác nghèo nếu như nhìn hai bên tai mà chỉ có một bên đeo còn một bên mất', '', 0, 0.00, 0, 1, 0, '2026-04-18 13:55:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `url` text NOT NULL,
  `isMain` tinyint(1) DEFAULT 0,
  `displayOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `productId`, `url`, `isMain`, `displayOrder`) VALUES
(5, 3, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', 1, 1),
(6, 4, 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80', 1, 1),
(7, 5, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 1, 1),
(19, 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', 0, 0),
(46, 2, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 0, 0),
(49, 1, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `originalPrice` decimal(15,2) DEFAULT NULL,
  `stockQuantity` int(11) DEFAULT 0,
  `isSale` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_variants`
--

INSERT INTO `product_variants` (`id`, `productId`, `sku`, `size`, `price`, `originalPrice`, `stockQuantity`, `isSale`, `createdAt`) VALUES
(301, 3, 'TIF-SMILE-YG-16', '16\"', 25000000.00, NULL, 15, 0, '2026-04-16 19:05:29'),
(401, 4, 'TIF-ELSA-PT-OS', 'One Size', 42000000.00, 48000000.00, 20, 1, '2026-04-16 19:05:29'),
(501, 5, 'VEL-DIA-NECK-OS', 'One Size', 85000000.00, 95000000.00, 15, 1, '2026-04-16 19:05:29'),
(522, 15, 'tmn-one-size', 'One size', 1400000.00, NULL, 12, 0, '2026-04-18 13:55:11'),
(593, 2, 'TIF-LOCK-RG-S', 'S', 190000000.00, NULL, 0, 0, '2026-04-18 16:27:53'),
(600, 1, 'TIF-KNOT-WG-3', '3', 145000000.00, NULL, 0, 1, '2026-04-18 16:38:03'),
(601, 1, 'TIF-KNOT-WG-5', '5', 145000000.00, NULL, 5, 1, '2026-04-18 16:38:03'),
(602, 1, 'TIF-KNOT-WG-7', '7', 145000000.00, NULL, 11, 0, '2026-04-18 16:38:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` char(36) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shop_settings`
--

CREATE TABLE `shop_settings` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `workingHours` varchar(255) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shop_settings`
--

INSERT INTO `shop_settings` (`id`, `phone`, `email`, `workingHours`, `updatedAt`) VALUES
(1, '1900 520 131', 'luxelum@gmail.com', 'T2-CN: 8:00 - 23:00', '2026-04-16 19:05:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `avatar`, `role`, `provider`, `phone`, `defaultAddress`, `newsletterOptin`, `createdAt`) VALUES
('admin-uuid-001', 'Admin Velmora', 'admin@velmora.com', '$2a$11$HeK3rWPI9G2IgBToEpYiDucfPiNfxpAD3NcsvW8NSCq5u99igvwJa', NULL, 'admin', 'email', '0901234567', NULL, 0, '2026-04-16 19:31:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlist`
--

CREATE TABLE `wishlist` (
  `userId` char(36) NOT NULL,
  `productId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_carts_user` (`userId`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cartitems_cart` (`cartId`),
  ADD KEY `fk_cartitems_product` (`productId`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug_unique` (`slug`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`userId`,`productId`),
  ADD KEY `fk_favorites_product` (`productId`);

--
-- Chỉ mục cho bảng `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug_unique` (`slug`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_user` (`userId`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_items_order` (`orderId`),
  ADD KEY `fk_items_product` (`productId`),
  ADD KEY `fk_items_variant` (`variantId`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku_unique` (`sku`),
  ADD KEY `fk_products_category` (`categoryId`),
  ADD KEY `fk_products_material` (`materialId`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_images_product` (`productId`);

--
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku_unique` (`sku`),
  ADD KEY `fk_variants_product` (`productId`);

--
-- Chỉ mục cho bảng `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reviews_user` (`user_id`),
  ADD KEY `fk_reviews_product` (`product_id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shop_settings`
--
ALTER TABLE `shop_settings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unique` (`email`);

--
-- Chỉ mục cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`userId`,`productId`),
  ADD KEY `fk_wishlist_product` (`productId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=603;

--
-- AUTO_INCREMENT cho bảng `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shop_settings`
--
ALTER TABLE `shop_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_carts_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cartitems_cart` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cartitems_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorites_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_items_variant` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_material` FOREIGN KEY (`materialId`) REFERENCES `materials` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_images_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `fk_variants_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
