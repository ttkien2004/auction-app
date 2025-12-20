# 🛍️ Cũ mà Chất - Nền tảng Đấu giá & Mua bán Đồ cũ

> **Đồ án môn học: Thương mại điện tử (CO3027)**
>
> Một nền tảng C2C (Consumer-to-Consumer) giúp người dùng mua bán, trao đổi và
> đấu giá các sản phẩm đã qua sử dụng, hướng tới mục tiêu tiêu dùng bền vững và
> bảo vệ môi trường.

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Hướng dẫn cài đặt nhanh](#-hướng-dẫn-cài-đặt-nhanh)
- [Đội ngũ thực hiện](#-đội-ngũ-thực-hiện)

---

## 🚀 Giới thiệu

**"Cũ mà Chất"** giải quyết vấn đề lãng phí tài nguyên bằng cách tạo ra vòng đời
thứ hai cho các sản phẩm. Hệ thống tích hợp hai hình thức giao dịch chính: **Mua
bán trực tiếp (Direct Sale)** và **Đấu giá trực tuyến (Online Auction)** theo
thời gian thực.

Dự án được xây dựng với kiến trúc hướng dịch vụ, dễ dàng mở rộng và triển khai
trên các nền tảng đám mây.

---

## ✨ Tính năng nổi bật

- **🛒 Sàn thương mại điện tử C2C:** Đăng bán sản phẩm, giỏ hàng, đặt hàng và
  quản lý đơn hàng.
- **🔨 Đấu giá thời gian thực:**
  - Hệ thống đếm ngược (Countdown timer).
  - Cập nhật giá bid ngay lập tức (Real-time bidding) mà không cần tải lại
    trang.
- **💬 Chat trực tuyến:** Người mua và người bán trao đổi trực tiếp thông qua
  Socket.io.
- **💳 Thanh toán tích hợp:** Hỗ trợ thanh toán qua ví điện tử MoMo.
- **📊 Kênh người bán (Seller Dashboard):** Quản lý kho hàng, theo dõi doanh
  thu, thống kê đơn hàng trực quan.
- **☁️ Lưu trữ tối ưu:** Sử dụng Cloudflare R2 để lưu trữ hình ảnh sản phẩm với
  chi phí thấp và tốc độ cao.

---

## 🛠 Công nghệ sử dụng

| Phân hệ               | Công nghệ                                   |
| :-------------------- | :------------------------------------------ |
| **Backend**           | Node.js, Express.js, Prisma ORM             |
| **Frontend**          | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 |
| **Database**          | MySQL                                       |
| **Real-time**         | Socket.io                                   |
| **Infrastructure**    | Docker, Docker Compose                      |
| **Cloud Services**    | Cloudflare R2 (Storage), Cloudflare CDN     |
| **API Documentation** | Swagger (OpenAPI 3.0)                       |

---

## 📂 Cấu trúc dự án

Dự án được chia thành hai phần chính, vui lòng truy cập từng thư mục để xem
hướng dẫn chi tiết:

### 1. 🖥️ Frontend

Giao diện người dùng và logic phía Client. 👉
**[Xem hướng dẫn chi tiết Frontend](./frontend/README.md)**

### 2. ⚙️ Backend

API Server, xử lý logic nghiệp vụ và kết nối cơ sở dữ liệu. 👉
**[Xem hướng dẫn chi tiết Backend](./backend/README.md)**

---

## ⚡ Hướng dẫn cài đặt nhanh

Dự án hỗ trợ chạy toàn bộ hệ thống (Full-stack) thông qua **Docker Compose**.

### Yêu cầu tiên quyết

- [Docker](https://www.docker.com/) & Docker Compose đã được cài đặt.
- Node.js (phiên bản 18 trở lên) nếu muốn chạy môi trường local.

### Chạy dự án

1. **Clone repository:**
   ```bash
   git clone [https://github.com/ttkien2004/auction-app.git](https://github.com/ttkien2004/auction-app.git)
   cd auction-app
   ```
