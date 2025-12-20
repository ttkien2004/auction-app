/*
 * SCRIPT TÁI TẠO DỮ LIỆU MẪU (SEED) - CẬP NHẬT CHO ĐẤU GIÁ
 * Sử dụng thời gian động (NOW) để luôn có dữ liệu active khi chạy
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
TRUNCATE TABLE CartItem; -- (Nếu bạn đã tạo bảng này)
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

-- Password mặc định là: password123 (đã hash)
INSERT INTO User (username, password, email, name, address, phone_number) VALUES
('an_nguyen', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'an@example.com', 'An Nguyễn', '123 CMT8, Q1, TPHCM', '0901234567'),
('binh_tran', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'binh@example.com', 'Bình Trần', '456 Lê Lợi, Q3, TPHCM', '0918765432'),
('chi_le', '$2a$10$f/e.xQ.E9./0z.E/e/0z.e/E/e/0z.E/e/0z.E/e/0z.E/e/0z.', 'chi@example.com', 'Chi Lê', '789 Nguyễn Trãi, Q5, TPHCM', '0987654321');

-- ---
-- 5. Role (Buyer/Seller)
-- ---
INSERT INTO Buyer (user_ID) VALUES (1), (2), (3); -- Cả 3 đều mua được
INSERT INTO Seller (user_ID) VALUES (1), (3); -- Chỉ An và Chi được bán

-- ---
-- 6. Category
-- ---
INSERT INTO Category (name, description, parent_category_ID) VALUES
('Đồ điện tử', 'Thiết bị điện tử', NULL), -- ID 1
('Thời trang', 'Quần áo, phụ kiện', NULL), -- ID 2
('Đồng hồ', 'Đồng hồ đeo tay, treo tường', 2); -- ID 3

-- ---
-- 7. Product & Auction (Dữ liệu quan trọng)
-- ---

-- [Product 1] DirectSale: Tai nghe (Đã có)
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) 
VALUES ('Tai nghe Bluetooth ABC', 'Tai nghe cũ giá rẻ.', 'active', 'DirectSale', 'like_new', 1, 1);
INSERT INTO DirectSale (product_ID, buy_now_price) VALUES (1, 500000);


-- [Product 2] Auction: Laptop Gaming (ĐANG DIỄN RA - ACTIVE)
-- Bắt đầu: Hôm qua (-1 DAY), Kết thúc: 2 ngày nữa (+2 DAY)
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) 
VALUES ('Laptop Gaming XYZ Cũ', 'Core i7, Ram 16GB, Card rời. Đấu giá nhanh!', 'active', 'Auction', 'used', 1, 1);

INSERT INTO Auction (product_ID, start_price, min_bid_incr, auc_start_time, auc_end_time) 
VALUES (2, 10000000, 500000, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY));


-- [Product 3] Auction: Đồng hồ cổ (SẮP DIỄN RA - UPCOMING)
-- Bắt đầu: Ngày mai (+1 DAY), Kết thúc: 5 ngày nữa (+5 DAY)
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) 
VALUES ('Đồng hồ Omega Cổ', 'Hàng sưu tầm từ năm 1990.', 'active', 'Auction', 'used', 3, 3);

INSERT INTO Auction (product_ID, start_price, min_bid_incr, auc_start_time, auc_end_time) 
VALUES (3, 5000000, 200000, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY));


-- [Product 4] Auction: Bàn phím cơ (ĐÃ KẾT THÚC - ENDED)
-- Bắt đầu: 5 ngày trước, Kết thúc: Hôm qua
INSERT INTO Product (name, description, status, type, pcondition, seller_ID, category_ID) 
VALUES ('Bàn phím cơ Keychron', 'Switch Red, còn bảo hành.', 'active', 'Auction', 'like_new', 3, 1);

INSERT INTO Auction (product_ID, start_price, min_bid_incr, auc_start_time, auc_end_time) 
VALUES (4, 1500000, 50000, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));


-- ---
-- 8. Bids (Đặt giá)
-- ---

-- Đặt giá cho Laptop (Product 2 - Đang diễn ra)
INSERT INTO Bid (bid_amount, buyer_ID, auction_ID) VALUES
(10000000, 2, 2), -- Bình đặt giá khởi điểm
(10500000, 3, 2), -- Chi đặt cao hơn
(11000000, 2, 2); -- Bình đặt lại (Hiện tại Bình thắng thế)

-- Đặt giá cho Bàn phím (Product 4 - Đã kết thúc)
INSERT INTO Bid (bid_amount, buyer_ID, auction_ID) VALUES
(1550000, 1, 4), -- An đặt giá
(1600000, 2, 4); -- Bình thắng

-- ---
-- 9. Transaction & Review
-- ---
-- Giao dịch mua Tai nghe (DirectSale)
INSERT INTO Transaction (item_type, status, final_amount, buyer_ID, product_ID) 
VALUES ('DirectSale', 'completed', 500000, 2, 1);

INSERT INTO Review (rating, comment, buyer_ID, transaction_ID) 
VALUES (5, 'Giao hàng nhanh, tai nghe tốt.', 2, 1);

-- ---
-- 10. Watchlist
-- ---
INSERT INTO Watchlist (user_ID, product_ID) VALUES
(2, 2), -- Bình theo dõi Laptop
(3, 2), -- Chi theo dõi Laptop
(1, 3); -- An theo dõi Đồng hồ