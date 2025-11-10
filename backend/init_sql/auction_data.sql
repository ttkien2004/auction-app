/*
 * SCRIPT TÁI TẠO DỮ LIỆU MẪU (SEED)
 * File này sẽ:
 * 1. Tắt kiểm tra khóa ngoại (Foreign Key).
 * 2. Xóa sạch (TRUNCATE) tất cả dữ liệu và reset ID về 1.
 * 3. Bật lại kiểm tra khóa ngoại.
 * 4. Chèn (INSERT) dữ liệu mẫu.
 *
 * CÓ THỂ CHẠY LẠI NHIỀU LẦN.
 */

USE AUCTION_APP;

-- ---
-- 1. TẮT KIỂM TRA KHÓA NGOẠI
-- ---
SET FOREIGN_KEY_CHECKS = 0;

-- ---
-- 2. XÓA SẠCH VÀ RESET BẢNG
-- (TRUNCATE TABLE sẽ xóa hết dữ liệu VÀ reset AUTO_INCREMENT)
-- ---
TRUNCATE TABLE Review;
TRUNCATE TABLE Transaction;
TRUNCATE TABLE Bid;
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
-- 4. CHÈN DỮ LIỆU MẪU (NỘI DUNG TỪ file insert_data.sql)
-- ---

-- User (IDs sẽ là 1, 2, 3)
INSERT INTO User (username, password, email, name, address, phone_number) VALUES
('an_nguyen', 'hashed_pass_123', 'an@example.com', 'An Nguyễn', '123 CMT8, Q1, TPHCM', '0901234567'),
('binh_tran', 'hashed_pass_123', 'binh@example.com', 'Bình Trần', '456 Lê Lợi, Q3, TPHCM', '0918765432'),
('chi_le', 'hashed_pass_123', 'chi@example.com', 'Chi Lê', '789 Nguyễn Trãi, Q5, TPHCM', '0987654321');

-- Buyer
INSERT INTO Buyer (user_ID) VALUES
(1), -- An Nguyễn
(2); -- Bình Trần

-- Seller
INSERT INTO Seller (user_ID) VALUES
(1), -- An Nguyễn
(3); -- Chi Lê

-- Category (IDs sẽ là 1, 2, 3)
INSERT INTO Category (name, description, parent_category_ID) VALUES
('Đồ điện tử', 'Các thiết bị điện tử gia dụng và cá nhân', NULL),
('Thời trang', 'Quần áo, giày dép và phụ kiện', NULL),
('Laptop & PC', 'Máy tính xách tay và máy tính để bàn', 1);

-- Product (IDs sẽ là 1, 2, 3, 4)
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) VALUES
('Laptop Gaming XYZ Cũ', 'Laptop XYZ, i7, 16GB RAM, SSD 512GB.', 'active', 'Auction', 'used', 1, 3),
('Áo khoác da nam', 'Áo khoác da thật 100%, size L, màu đen, hàng mới.', 'active', 'DirectSale', 'new', 3, 2),
('Tai nghe Bluetooth ABC', 'Tai nghe không dây, chống ồn, pin 20h, như mới.', 'active', 'DirectSale', 'like_new', 1, 1),
('Máy ảnh Sony A6000', 'Máy ảnh đã qua sử dụng, kèm lens kit 16-50mm.', 'expired', 'Auction', 'used', 3, 1);

-- DirectSale
INSERT INTO DirectSale (product_ID, buy_now_price) VALUES
(2, 1200000), -- Áo khoác da (Product ID 2)
(3, 500000);  -- Tai nghe (Product ID 3)

-- Auction
INSERT INTO Auction (product_ID, start_price, min_bid_incr, auc_start_time, auc_end_time) VALUES
(1, 10000000, 100000, '2025-11-07 10:00:00', '2025-11-15 22:00:00'), -- Laptop (Product ID 1)
(4, 5000000, 50000, '2025-11-01 10:00:00', '2025-11-07 22:00:00');  -- Máy ảnh (Product ID 4)

-- Bid
INSERT INTO Bid (bid_amount, buyer_ID, auction_ID) VALUES
(10100000, 2, 1), -- Bình (Buyer 2) đặt giá Laptop (Auction 1)
(10200000, 1, 1), -- An (Buyer 1) đặt giá Laptop (Auction 1)
(5050000, 2, 4), -- Bình (Buyer 2) đặt giá Máy ảnh (Auction 4)
(5100000, 1, 4); -- An (Buyer 1) đặt giá Máy ảnh (Auction 4)

-- Transaction (IDs sẽ là 1, 2)
INSERT INTO Transaction (item_type, status, final_amount, buyer_ID, product_ID) VALUES
('DirectSale', 'completed', 500000, 2, 3), -- Bình (Buyer 2) mua Tai nghe (Product 3)
('Auction', 'pending_payment', 5100000, 1, 4); -- An (Buyer 1) thắng đấu giá Máy ảnh (Product 4)

-- Review
INSERT INTO Review (rating, comment, buyer_ID, transaction_ID) VALUES
(5, 'Tai nghe dùng tốt, giao hàng nhanh!', 2, 1); -- Bình (Buyer 2) đánh giá Giao dịch 1