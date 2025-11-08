# 🛍️ Auction App Frontend

Giao diện người dùng cho ứng dụng đấu giá trực tuyến.  
Dự án được xây dựng bằng **HTML, CSS, JavaScript (thuần)**, có hỗ trợ
**Socket.IO** để giao tiếp thời gian thực giữa người mua và người bán.

---

## 📁 Cấu trúc thư mục

```bash
frontend/
├── assets/ # Chứa hình ảnh, icon, và tài nguyên tĩnh
│ ├── images/
│ ├── icons/
│ └── ...
│
├── bootstrap/ # Thư viện Bootstrap (CSS, JS) được tải về thủ công
│ ├── css/
│ └── js/
│
├── buyer/ # Trang và giao diện dành cho người mua
│ ├── buyer.html
│ ├── buyer-dashboard.html
│ ├── buyer-bid.html
│ └── ...
│
├── seller/ # Trang và giao diện dành cho người bán
│ ├── seller.html
│ ├── seller-dashboard.html
│ ├── seller-auctions.html
│ └── ...
│
├── css/ # Chứa file CSS dùng chung
│ └── index.css
│
├── scripts/ # Chứa các script xử lý logic (fetch API, validation, DOM)
│ ├── auth.js
│ ├── buyer.js
│ ├── seller.js
│ ├── ui.js
│ └── ...
│
├── socket/ # Các file xử lý socket (real-time)
│ ├── buyerSocket.js
│ ├── sellerSocket.js
│ └── ...
│
└── index.html # Trang chính
```

---

## 🚀 Cách chạy dự án

### 🔹 Cách 1: Mở trực tiếp

Chỉ cần mở file `index.html` bằng trình duyệt:

```bash
frontend/index.html
```

### 🔹 Cách 2: Sử Open Live Server

- Vào mục `Extension` của VSCode.

- Tìm Live Server -> Tải nó.

- Click chuột phải vào file html bất kỳ, kiếm dòng `Open Live Server`.

Dùng Live Server giúp mỗi lần có thay đổi code, trang cũng sẽ tự động cập nhật.
