import userApi from "../services/userApi.js";
import productApi from "../services/productApi.js";
import reviewApi from "../services/reviewApi.js";
import sellerApi from "../services/sellerApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

// Lấy Seller ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const sellerId = urlParams.get("id");

// Biến lưu trữ dữ liệu toàn cục để lọc tab
let allProducts = [];

// DOM Elements
// DOM Elements
const els = {
	shopName: document.getElementById("shop-name"),
	shopAvatar: document.getElementById("shop-avatar"),
	shopLocation: document.getElementById("shop-location"),
	shopJoinDate: document.getElementById("shop-join-date"),
	productCount: document.getElementById("shop-products-count"),

	grid: document.getElementById("product-grid"),
	tabs: document.querySelectorAll(".tab-btn"),

	btnChat: document.getElementById("btn-chat"),
	btnFollow: document.getElementById("btn-follow"),
};

document.addEventListener("DOMContentLoaded", async () => {
	// if (!sellerId) {
	// 	alert("Không tìm thấy thông tin Shop.");
	// 	window.location.href = "../index.html";
	// 	return;
	// }

	// 1. Tải thông tin Shop & Sản phẩm song song
	await Promise.all([loadShopInfo(), loadShopProducts()]);

	// 2. Cài đặt sự kiện chuyển Tab
	setupTabs();

	// 3. Cài đặt nút Chat
	setupChatButton();
});

async function loadShopInfo() {
	try {
		// Gọi API lấy thông tin public của User (Seller)
		const response = await userApi.getUserProfile();

		if (!response) throw new Error("Không tải được thông tin Shop");

		const user = response;

		// Render dữ liệu
		els.shopName.innerText = user.name || user.username || "Cửa hàng ẩn danh";
		els.shopLocation.innerText = user.address || "Toàn quốc";
		els.shopJoinDate.innerText = new Date(user.created_at).toLocaleDateString(
			"vi-VN"
		);

		if (user.avatar) {
			els.shopAvatar.src = `${R2_PUBLIC_URL}/${user.avatar}`;
		} else {
			els.shopAvatar.src = "https://placehold.co/150?text=Shop";
		}
	} catch (error) {
		console.error(error);
		els.shopName.innerText = "Lỗi tải dữ liệu";
	}
}

async function loadShopProducts() {
	els.grid.innerHTML =
		'<p class="text-center w-100 py-5">Đang tải sản phẩm...</p>';

	try {
		// Gọi API lấy sản phẩm của Seller này
		const response = await sellerApi.getSellerProducts();

		if (!response) throw new Error("Lỗi tải sản phẩm");

		const data = response;
		allProducts = data || []; // Lưu vào biến toàn cục

		// Cập nhật số lượng sản phẩm trên Header
		if (els.productCount) els.productCount.innerText = allProducts.length;

		// Mặc định hiển thị Tab "Đang bán" (DirectSale)
		filterAndRender("DirectSale");
	} catch (error) {
		console.error(error);
		els.grid.innerHTML =
			'<p class="text-center text-danger w-100">Không thể tải danh sách sản phẩm.</p>';
	}
}

// --- 3. XỬ LÝ TABS ---
function setupTabs() {
	els.tabs.forEach((btn) => {
		btn.addEventListener("click", () => {
			// UI Active
			els.tabs.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			// Lọc dữ liệu
			const tabType = btn.dataset.tab; // 'direct', 'auction', 'reviews'

			if (tabType === "reviews") {
				// Xử lý hiển thị đánh giá (Nếu bạn đã làm phần Review)
				renderReviewsPlaceholder();
			} else {
				// Map 'direct' -> 'DirectSale', 'auction' -> 'Auction'
				const typeFilter = tabType === "direct" ? "DirectSale" : "Auction";
				filterAndRender(typeFilter);
			}
		});
	});
}

// --- 4. LỌC VÀ RENDER GRID ---
function filterAndRender(type) {
	// Lọc từ danh sách đã tải về
	const filtered = allProducts.filter((p) => p.type === type);

	if (filtered.length === 0) {
		els.grid.innerHTML = `<div class="text-center w-100 py-5 text-muted">
            <i class="fas fa-box-open fa-3x mb-3"></i>
            <p>Shop chưa có sản phẩm nào ở mục này.</p>
        </div>`;
		return;
	}
	const html = filtered
		.map((p) => {
			const isAuction = p.type === "Auction";

			// Xử lý Giá
			const priceRaw = isAuction
				? p.Auction?.start_price
				: p.DirectSale?.buy_now_price;
			const price = formatMoney(priceRaw);

			// Xử lý Ảnh
			const img = p.image
				? `${R2_PUBLIC_URL}${p.image}`
				: "https://placehold.co/200";

			// Link chi tiết
			const link = isAuction
				? `auction/detail.html?id=${p.ID}`
				: `product-detail.html?id=${p.ID}`;

			const label = isAuction ? "ĐẤU GIÁ" : "MUA NGAY";
			const badgeClass = isAuction ? "bg-warning text-dark" : "bg-success";

			return `
        <div class="col">
            <div class="product-card h-100" onclick="window.location.href='${link}'">
                <div class="p-img" style="background-image: url('${img}')"></div>
                <div class="p-info">
                    <span class="badge ${badgeClass} mb-2 w-auto" style="width:fit-content">${label}</span>
                    <h6 class="p-name text-truncate">${p.name}</h6>
                    <div class="p-price mt-auto">${price}</div>
                </div>
            </div>
        </div>
        `;
		})
		.join("");

	els.grid.innerHTML = html;
}

// --- 5. NÚT CHAT ---
function setupChatButton() {
	if (!els.btnChat) return;

	els.btnChat.addEventListener("click", async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Vui lòng đăng nhập để chat với Shop.");
			window.location.href = "../auth/index.html";
			return;
		}

		const currentUser = JSON.parse(localStorage.getItem("user"));
		if (currentUser.ID == sellerId) {
			alert("Đây là cửa hàng của bạn!");
			return;
		}

		// Logic bắt đầu chat (Gọi API startChat)
		try {
			// Bạn có thể gọi API /chat/start tại đây, hoặc chuyển hướng
			// Giả sử chuyển hướng kèm tham số partnerId để trang chat tự xử lý
			window.location.href = `../html/chat.html?partnerId=${sellerId}`;
		} catch (e) {
			console.error(e);
		}
	});
}

// --- HELPERS ---
function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount || 0);
}

function renderReviewsPlaceholder() {
	els.grid.innerHTML = `
        <div class="text-center w-100 py-5">
            <p>Tính năng xem đánh giá Shop đang được cập nhật...</p>
            <a href="../reviews/index.html?sellerId=${sellerId}" class="btn btn-outline-teal rounded-pill">Xem tất cả đánh giá</a>
        </div>
    `;
}
