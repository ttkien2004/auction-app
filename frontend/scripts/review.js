// js/reviews.js
import reviewApi from "../services/reviewApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

const urlParams = new URLSearchParams(window.location.search);
const sellerId = urlParams.get("sellerId");
const transactionId = urlParams.get("transactionId"); // Lấy thêm tham số này

const reviewListEl = document.getElementById("review-list");
let currentReviews = [];

document.addEventListener("DOMContentLoaded", async () => {
	// 1. TRƯỜNG HỢP: Xem đánh giá của ĐƠN HÀNG (1 cái)
	if (transactionId) {
		console.log("Đang xem đánh giá đơn hàng:", transactionId);
		// Ẩn hoặc sửa tiêu đề cho phù hợp
		document.querySelector(".box-title").innerText = "Đánh giá đơn hàng này";
		await loadReviewByTransaction(transactionId);
	}
	// 2. TRƯỜNG HỢP: Xem đánh giá của SHOP (Nhiều cái)
	else if (sellerId) {
		console.log("Đang xem đánh giá shop:", sellerId);
		document.querySelector(".box-title").innerText = "Tổng quan Shop";
		await loadReviewsBySeller(sellerId);
	} else {
		alert("Không tìm thấy thông tin đánh giá");
		window.history.back();
	}
});

// Hàm 1: Load theo Seller
async function loadReviewsBySeller(id) {
	try {
		reviewListEl.innerHTML = '<p class="text-center">Đang tải...</p>';
		const reviews = await reviewApi.getReviewsBySeller(id);
		renderReviews(reviews);
		calculateOverview(reviews); // Tính toán sao trung bình
	} catch (error) {
		console.error(error);
		reviewListEl.innerHTML = '<p class="text-center">Lỗi tải dữ liệu.</p>';
	}
}

// Hàm 2: Load theo Transaction
async function loadReviewByTransaction(id) {
	try {
		reviewListEl.innerHTML = '<p class="text-center">Đang tải...</p>';
		const reviews = await reviewApi.getAllReviews(id);

		if (!reviews || reviews.length === 0) {
			reviewListEl.innerHTML =
				'<p class="text-center text-muted">Đơn hàng này chưa có đánh giá.</p>';
			// Ẩn phần tổng quan vì chỉ có 0 hoặc 1 review
			document.querySelector(".rating-overview").style.display = "none";
			// Mở rộng cột danh sách ra full màn hình
			document.querySelector(".col-md-8").className = "col-md-12";
			return;
		}

		renderReviews(reviews);

		// Ẩn phần tổng quan vì xem chi tiết 1 đơn thì không cần thống kê
		document.querySelector(".rating-overview").style.display = "none";
		document.querySelector(".col-md-8").className = "col-md-12";
	} catch (error) {
		console.error(error);
		reviewListEl.innerHTML = '<p class="text-center">Lỗi tải dữ liệu.</p>';
	}
}

// Hàm Render (Dùng chung)
function renderReviews(reviews) {
	const reviewListEl = document.getElementById("review-list");
	currentReviews = reviews;

	// 1. Kiểm tra dữ liệu rỗng
	if (!reviews || reviews.length === 0) {
		reviewListEl.innerHTML = `
            <div class="text-center py-5">
                <i class="far fa-comment-dots fa-3x text-muted mb-3"></i>
                <p class="text-muted">Chưa có đánh giá nào.</p>
            </div>
        `;
		return;
	}

	// 2. Map dữ liệu ra HTML
	const html = reviews
		.map((r, index) => {
			// --- Xử lý Avatar ---
			// Kiểm tra xem user có avatar không, nếu có thì ghép URL R2, không thì dùng ảnh placeholder
			const avatarPath = r.Buyer?.User?.avatar;
			const avatarUrl = avatarPath
				? `${R2_PUBLIC_URL}${avatarPath}`
				: "https://placehold.co/50?text=User";

			// --- Xử lý Tên người dùng ---
			const userName = r.Buyer?.User?.name || "Người dùng ẩn danh";

			// --- Xử lý Ngày tháng ---
			const date = new Date(r.created_at).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});

			// --- Xử lý Sao (Rating) ---
			let starsHtml = "";
			for (let i = 1; i <= 5; i++) {
				if (i <= r.rating) {
					starsHtml += '<i class="fas fa-star text-warning"></i>'; // Sao vàng
				} else {
					starsHtml += '<i class="far fa-star text-warning"></i>'; // Sao rỗng
				}
			}

			// --- Lấy tên sản phẩm liên quan ---
			const productName = r.Transaction?.Product?.name || "Sản phẩm";

			// --- Template HTML cho 1 thẻ Review ---
			return `
        <div class="review-card" id="review-card-${index}" onclick="selectReview(${index})">
            <div class="reviewer-info d-flex align-items-center mb-2">
                <img src="${avatarUrl}" class="reviewer-avatar me-3">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <h6 class="reviewer-name mb-0 fw-bold text-teal">${userName}</h6>
                        <span class="review-time text-muted small">${date}</span>
                    </div>
                    <div class="rating-stars small mt-1">${starsHtml}</div>
                </div>
            </div>

            <div class="product-context mb-2">
                <span class="badge bg-light text-secondary border fw-normal">
                    <i class="fas fa-tag me-1"></i> ${productName}
                </span>
            </div>

            <div class="review-content text-dark">
                ${r.comment || "<em>Không có lời bình.</em>"}
            </div>
        </div>
        `;
		})
		.join("");

	if (reviews.length > 0) {
		selectReview(0);
	}

	// 3. Đổ vào giao diện
	reviewListEl.innerHTML = html;
}

// Hàm tính toán tổng quan (Dành cho Seller)
function calculateOverview(reviews) {
	if (!reviews.length) return;

	// Tính trung bình
	const total = reviews.reduce((sum, r) => sum + r.rating, 0);
	const avg = (total / reviews.length).toFixed(1);

	document.querySelector(".score-big").innerText = avg;
	document.querySelector(
		"small.text-muted"
	).innerText = `(${reviews.length} đánh giá)`;

	// (Nâng cao: Tính % cho từng thanh progress bar nếu muốn)
}

window.selectReview = (index) => {
	const review = currentReviews[index];
	if (!review) return;

	// 1. Highlight giao diện (CSS)
	// Xóa active cũ
	document
		.querySelectorAll(".review-card")
		.forEach((el) => el.classList.remove("active"));
	// Thêm active mới
	const activeCard = document.getElementById(`review-card-${index}`);
	if (activeCard) activeCard.classList.add("active");

	// 2. Cập nhật Product Snippet (Div phía trên)
	const product = review.Transaction?.Product;
	if (product) {
		// Ảnh
		const imgUrl = product.image
			? `${R2_PUBLIC_URL}${product.image}`
			: "https://placehold.co/80";
		document.querySelector(".product-snippet img").src = imgUrl;

		// Tên sản phẩm
		document.querySelector(".product-snippet h5").innerText = product.name;

		// Tên người bán
		const sellerName = product.Seller?.User?.name || "Shop";
		document.querySelector(
			".product-snippet p"
		).innerText = `Người bán: ${sellerName}`;

		// Link quay lại
		// Kiểm tra loại sản phẩm để link đúng trang (Auction/Product)
		const type =
			product.type === "Auction"
				? "auction/detail.html"
				: "product-detail.html";
		const linkBtn = document.querySelector(".product-snippet a");
		linkBtn.href = `../html/${type}?id=${product.ID}`;
		linkBtn.innerText = "Xem chi tiết sản phẩm này";
	}
};
