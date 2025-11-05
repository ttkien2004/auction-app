CREATE DATABASE AUCTION_APP;

USE AUCTION_APP;

-- ---
-- Bảng chính cho Người dùng (Superclass)
-- ---
CREATE TABLE User (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Nên lưu trữ mật khẩu đã được hash
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100),
    address VARCHAR(255),
    phone_number VARCHAR(20) -- Thuộc tính 'phone_number' từ EERD
);

-- ---
-- Bảng Buyer (Subclass của User)
-- Thực hiện mối quan hệ ISA (IS-A)
-- ---
CREATE TABLE Buyer (
    user_ID INT PRIMARY KEY,
    FOREIGN KEY (user_ID) REFERENCES User(ID) ON DELETE CASCADE
);

-- ---
-- Bảng Seller (Subclass của User)
-- Thực hiện mối quan hệ ISA (IS-A)
-- ---
CREATE TABLE Seller (
    user_ID INT PRIMARY KEY,
    FOREIGN KEY (user_ID) REFERENCES User(ID) ON DELETE CASCADE
);

-- ---
-- Bảng Category (Danh mục)
-- Có mối quan hệ đệ quy (tự tham chiếu) để tạo danh mục cha-con
-- ---
CREATE TABLE Category (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_ID INT, -- Mối quan hệ đệ quy 'Contain'
    FOREIGN KEY (parent_category_ID) REFERENCES Category(ID) ON DELETE SET NULL
);

-- ---
-- Bảng Product (Sản phẩm - Superclass)
-- ---
CREATE TABLE Product (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    type VARCHAR(50), -- Có thể dùng để phân biệt 'Auction'/'DirectSale'
    pcondition VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seller_ID INT NOT NULL,
    category_ID INT NOT NULL,
    FOREIGN KEY (seller_ID) REFERENCES Seller(user_ID), -- Quan hệ 'Sell'
    FOREIGN KEY (category_ID) REFERENCES Category(ID) -- Quan hệ 'Contain'
);

-- ---
-- Bảng DirectSale (Bán trực tiếp - Subclass của Product)
-- ---
CREATE TABLE DirectSale (
    product_ID INT PRIMARY KEY,
    buy_now_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (product_ID) REFERENCES Product(ID) ON DELETE CASCADE
);

-- ---
-- Bảng Auction (Đấu giá - Subclass của Product)
-- ---
CREATE TABLE Auction (
    product_ID INT PRIMARY KEY, -- 'ID' trên EERD được hiểu là PK kế thừa từ Product
    start_price DECIMAL(10, 2) NOT NULL,
    min_bid_incr DECIMAL(10, 2), -- min_bid_incr
    auc_start_time DATETIME NOT NULL,
    auc_end_time DATETIME NOT NULL,
    FOREIGN KEY (product_ID) REFERENCES Product(ID) ON DELETE CASCADE
);

-- ---
-- Bảng Bid (Phiên đặt giá)
-- ---
CREATE TABLE Bid (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    bid_amount DECIMAL(10, 2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 'bid_time' trong EERD
    buyer_ID INT NOT NULL,
    auction_ID INT NOT NULL,
    FOREIGN KEY (buyer_ID) REFERENCES Buyer(user_ID), -- Quan hệ 'Join'
    FOREIGN KEY (auction_ID) REFERENCES Auction(product_ID) -- Quan hệ với Auction
);

-- ---
-- Bảng Transaction (Giao dịch)
-- ---
CREATE TABLE Transaction (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    item_type VARCHAR(50), -- 'auction' hoặc 'direct_sale'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    final_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    buyer_ID INT NOT NULL,
--     direct_sale_ID INT, -- Có thể rỗng (nullable)
--     auction_ID INT, -- Có thể rỗng (nullable)
    product_ID INT,
    FOREIGN KEY (buyer_ID) REFERENCES Buyer(user_ID), -- Quan hệ 'Make'
--     FOREIGN KEY (direct_sale_ID) REFERENCES DirectSale(product_ID), -- Quan hệ 'Have'
--     FOREIGN KEY (auction_ID) REFERENCES Auction(product_ID), -- Quan hệ 'Have'
	FOREIGN KEY (product_id) REFERENCES Product(id)
);

-- ---
-- Bảng Review (Đánh giá)
-- ---
CREATE TABLE Review (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    buyer_ID INT NOT NULL,
    transaction_ID INT NOT NULL,
    FOREIGN KEY (buyer_ID) REFERENCES Buyer(user_ID), -- Quan hệ 'Give'
    FOREIGN KEY (transaction_ID) REFERENCES Transaction(ID) -- Quan hệ 'Belong to'
);