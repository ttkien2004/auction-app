/*
 * SCRIPT TÁI TẠO DỮ LIỆU MẪU (SEED)
 * ĐÃ CẬP NHẬT FONT TIẾNG VIỆT (UTF-8) VÀ WATCHLIST
 */

-- Sửa lỗi font: Đặt charset cho database
CREATE DATABASE IF NOT EXISTS AUCTION_APP
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE AUCTION_APP;

-- ---
-- 1. TẮT KIỂM TRA KHÓA NGOẠI
-- ---
SET FOREIGN_KEY_CHECKS = 0;

-- ---
-- 2. XÓA SẠCH VÀ RESET BẢNG
-- ---
TRUNCATE TABLE Review;
TRUNCATE TABLE Transaction;
TRUNCATE TABLE Bid;
TRUNCATE TABLE Watchlist;
TRUNCATE TABLE Auction;
TRUNCATE TABLE DirectSale;
TRUNCATE TABLE Product;
TRUNCATE TABLE Category;
TRUNCATE TABLE Buyer;
TRUNCATE TABLE Seller;
TRUNCATE TABLE User;

-- ---
-- 3. BẬT LẠI KIỂM TRA KHÓA NGOẠI
-- ---
SET FOREIGN_KEY_CHECKS = 1;

-- ---
-- 4. Bảng User
-- (Sửa lỗi font: Đặt charset cho bảng)
-- ---
CREATE TABLE IF NOT EXISTS User (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100),
    address VARCHAR(255),
    phone_number VARCHAR(20)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO User (username, password, email, name, address, phone_number) VALUES
('an_nguyen', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'an@example.com', 'An Nguyễn', '123 CMT8, Q1, TPHCM', '0901234567'),
('binh_tran', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'binh@example.com', 'Bình Trần', '456 Lê Lợi, Q3, TPHCM', '0918765432'),
('chi_le', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'chi@example.com', 'Chi Lê', '789 Nguyễn Trãi, Q5, TPHCM', '0987654321');

-- (Các bảng khác cũng nên được tạo với IF NOT EXISTS và DEFAULT CHARSET...)
-- ... (Các bảng Buyer, Seller, Category...)

-- ---
-- 5. CHÈN DỮ LIỆU (Giả sử các bảng đã tồn tại)
-- ---

-- Buyer
INSERT INTO Buyer (user_ID) VALUES (1), (2);

-- Seller
INSERT INTO Seller (user_ID) VALUES (1), (3);

-- Category
INSERT INTO Category (name, description, parent_category_ID) VALUES
('Đồ điện tử', 'Các thiết bị điện tử gia dụng và cá nhân', NULL),
('Thời trang', 'Quần áo, giày dép và phụ kiện', NULL),
('Laptop & PC', 'Máy tính xách tay và máy tính để bàn', 1);

-- Product
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) VALUES
('Laptop Gaming XYZ Cũ', 'Laptop XYZ, i7, 16GB RAM, SSD 512GB.', 'active', 'Auction', 'used', 1, 3),
('Áo khoác da nam', 'Áo khoác da thật 100%, size L, màu đen, hàng mới.', 'active', 'DirectSale', 'new', 3, 2),
('Tai nghe Bluetooth ABC', 'Tai nghe không dây, chống ồn, pin 20h, như mới.', 'active', 'DirectSale', 'like_new', 1, 1),
('Máy ảnh Sony A6000', 'Máy ảnh đã qua sử dụng, kèm lens kit 16-50mm.', 'expired', 'Auction', 'used', 3, 1);

-- DirectSale
INSERT INTO DirectSale (product_ID, buy_now_price) VALUES
(2, 1200000),
(3, 500000);

-- Auction
INSERT INTO Auction (product_ID, start_price, min_bid_incr, auc_start_time, auc_end_time) VALUES
(1, 10000000, 100000, '2025-11-07 10:00:00', '2025-11-15 22:00:00'),
(4, 5000000, 50000, '2025-11-01 10:00:00', '2025-11-07 22:00:00');

-- Bid
INSERT INTO Bid (bid_amount, buyer_ID, auction_ID) VALUES
(10100000, 2, 1),
(10200000, 1, 1),
(5050000, 2, 4),
(5100000, 1, 4);

-- Transaction
INSERT INTO Transaction (item_type, status, final_amount, buyer_ID, product_ID) VALUES
('DirectSale', 'completed', 500000, 2, 3),
('Auction', 'pending_payment', 5100000, 1, 4);

-- Review
INSERT INTO Review (rating, comment, buyer_ID, transaction_ID) VALUES
(5, 'Tai nghe dùng tốt, giao hàng nhanh!', 2, 1);

-- ---
-- 11. Bảng Watchlist (ĐÃ THÊM MỚI)
-- ---
INSERT INTO Watchlist (user_ID, product_ID) VALUES
(2, 1), -- Bình (Buyer 2) theo dõi Laptop (Product 1)
(1, 2), -- An (Buyer 1) theo dõi Áo khoác (Product 2)
(2, 4); -- Bình (Buyer 2) theo dõi Máy ảnh (Product 4)