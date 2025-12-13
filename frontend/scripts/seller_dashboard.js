import userApi from "../services/userApi.js";
import sellerApi from "../services/sellerApi.js";
import transactionApi from "../services/transactionApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

// Biến toàn cục
let sellerModal;
let targetTransactionId = null;
const user = JSON.parse(localStorage.getItem("user" || "{}"));
let currentUserId = user.id;

document.addEventListener("DOMContentLoaded", async () => {
	console.log("Seller Dashboard Loaded");

	// 1. KIỂM TRA ĐĂNG NHẬP
	// 2. KHỞI TẠO UI (Modal, Tabs)
	initUI();

	// 3. TẢI DỮ LIỆU NGƯỜI DÙNG & DASHBOARD
	await loadData();
});

// --- HÀM KHỞI TẠO UI ---
function initUI() {
	// A. Cài đặt chuyển Tab
	// Sửa selector để khớp với class trong HTML (.menu-item)
	const buttons = document.querySelectorAll(".menu-item[data-tab]");

	buttons.forEach((btn) => {
		btn.addEventListener("click", () => {
			// UI Active
			buttons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			// Ẩn/Hiện Content
			const tabName = btn.dataset.tab;
			document
				.querySelectorAll(".content-section")
				.forEach((sec) => sec.classList.add("d-none"));

			const targetView = document.getElementById(`view-${tabName}`);
			if (targetView) targetView.classList.remove("d-none");

			// Tải dữ liệu tương ứng (Lazy Load)
			currentUserId = user.id;
			if (currentUserId) {
				if (tabName === "dashboard") loadDashboardData(currentUserId);
				if (tabName === "products") loadProducts();
				if (tabName === "orders") loadTransactions();
			}
		});
	});

	// B. Khởi tạo Modal Hủy Đơn
	const modalEl = document.getElementById("cancelSellerModal");
	if (modalEl && window.bootstrap) {
		sellerModal = new bootstrap.Modal(modalEl);
	}

	// C. Gắn sự kiện cho nút Xác nhận Hủy
	const btnConfirm = document.getElementById("btn-seller-confirm-cancel");
	if (btnConfirm) {
		btnConfirm.addEventListener("click", handleCancelOrder);
	}

	// D. Xử lý ẩn/hiện ô "Lý do khác"
	const radios = document.querySelectorAll('input[name="sellerReason"]');
	radios.forEach((r) => {
		r.addEventListener("change", (e) => {
			const txt = document.getElementById("seller-reason-text");
			if (txt)
				txt.style.display = e.target.value === "other" ? "block" : "none";
		});
	});
}

// --- HÀM TẢI DỮ LIỆU CHUNG ---
async function loadData() {
	try {
		const res = await userApi.getUserProfile();
		const user = res.profile;
		currentUserId = user.ID;

		// Điền thông tin Header
		document.getElementById("seller-name").innerText =
			user.name || user.username;
		if (user.avatar) {
			document.getElementById("seller-avatar").src =
				R2_PUBLIC_URL + user.avatar;
		}

		// Mặc định tải Dashboard
		await loadDashboardData(currentUserId);
	} catch (error) {
		console.error("Lỗi tải profile:", error);
	}
}

// --- 1. LOGIC DASHBOARD (THỐNG KÊ) ---
async function loadDashboardData(userId) {
	try {
		const transactions = await sellerApi.getSellerTransactions();
		const listContainer = document.getElementById("dashboard-order-list");

		// Reset Stats
		const stats = { revenue: 0, pending: 0, failed: 0, completed: 0 };

		if (!transactions || transactions.length === 0) {
			if (listContainer)
				listContainer.innerHTML =
					'<tr><td colspan="4" class="text-center py-4 text-muted">Chưa có đơn hàng nào.</td></tr>';
			updateStatsUI(stats);
			return;
		}

		// Tính toán
		transactions.forEach((t) => {
			const amt = Number(t.final_amount || 0);
			if (t.status === "completed") {
				stats.revenue += amt;
				stats.completed++;
			} else if (t.status === "pending_payment" || t.status === "pending") {
				stats.pending++;
			} else if (t.status === "cancelled" || t.status === "failed") {
				stats.failed++;
			}
		});
		updateStatsUI(stats);

		// Render Bảng (5 đơn mới nhất)
		if (listContainer) {
			const recentOrders = transactions.slice(0, 5);
			listContainer.innerHTML = recentOrders
				.map((t) => createTransactionRow(t))
				.join("");
		}
	} catch (error) {
		console.error(error);
	}
}

function updateStatsUI(stats) {
	document.getElementById("stat-revenue").innerText = formatMoney(
		stats.revenue
	);
	document.getElementById("stat-pending").innerText = stats.pending;
	document.getElementById("stat-failed").innerText = stats.failed;
	document.getElementById("stat-completed").innerText = stats.completed;
}

// --- 2. LOGIC LOAD SẢN PHẨM ---
async function loadProducts() {
	const container = document.getElementById("seller-products-list");
	if (!container) return;

	container.innerHTML =
		'<p class="text-center mt-5">Đang tải danh sách sản phẩm...</p>';

	try {
		const products = await sellerApi.getSellerProducts();

		if (!products || products.length === 0) {
			container.innerHTML =
				'<p class="text-center text-muted py-5">Bạn chưa đăng bán sản phẩm nào.</p>';
			return;
		}

		// Render danh sách (Dùng card giống seller_list.js cũ nhưng style lại cho đẹp)
		const html = products
			.map((p) => {
				const imgUrl = p.image
					? R2_PUBLIC_URL + p.image
					: "https://placehold.co/120";

				// Label loại sản phẩm
				const typeLabel =
					p.type === "Auction"
						? '<span class="badge bg-warning text-dark">Đấu giá</span>'
						: '<span class="badge bg-success">Bán ngay</span>';

				const price =
					p.type === "Auction"
						? p.Auction?.start_price
						: p.DirectSale?.buy_now_price;

				const watchProduct =
					p.type === "Auction"
						? `../auction/index.html?id=${p.ID}`
						: `../product-detail/index.html?id=${p.ID}`;
				return `
            <div class="card mb-3 border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                    <img src="${imgUrl}" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #eee;">
                    
                    <div class="flex-grow-1">
                        <h5 class="mb-1 fw-bold text-teal">${p.name}</h5>
                        <div class="mb-1 small">${typeLabel} <span class="text-muted ms-2">Mã: AOC_${
					p.ID
				}</span></div>
                        <div class="fw-bold">${formatMoney(price)}</div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <a href="${watchProduct}" class="btn btn-sm btn-outline-secondary">Xem</a>
                        <button class="btn btn-sm btn-outline-primary">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger">Xóa</button>
                    </div>
                </div>
            </div>
            `;
			})
			.join("");

		container.innerHTML = html;
	} catch (error) {
		console.error(error);
		container.innerHTML =
			'<p class="text-danger text-center">Lỗi tải danh sách sản phẩm</p>';
	}
}

// --- 3. LOGIC LOAD ĐƠN HÀNG (Hiện thực hàm bạn cần) ---
async function loadTransactions() {
	const container = document.getElementById("transaction-list");
	if (!container) return;

	container.innerHTML =
		'<p class="text-center mt-5">Đang tải danh sách đơn hàng...</p>';

	try {
		const transactions = await sellerApi.getSellerTransactions();

		if (!transactions || transactions.length === 0) {
			container.innerHTML =
				'<p class="text-center text-muted py-5">Chưa có đơn hàng nào.</p>';
			return;
		}

		const html = transactions
			.map((t) => {
				const product = t.Product || {};
				const buyerName = t.Buyer?.User?.name || "Khách ẩn danh";
				const imgUrl = product.image
					? R2_PUBLIC_URL + product.image
					: "https://placehold.co/100";

				const statusBadge = getStatusBadge(t.status);

				// Nút hành động dựa trên trạng thái
				let actionButtons = "";
				if (t.status === "pending_payment") {
					actionButtons = `
                    <button class="btn btn-sm btn-outline-danger rounded-pill me-2" onclick="window.openSellerCancel(${t.ID})">Hủy đơn</button>
                    <button class="btn btn-sm btn-teal-solid rounded-pill">Giao hàng</button>
                `;
				} else {
					actionButtons = `<button class="btn btn-sm btn-light text-muted rounded-pill" disabled>${t.status}</button>`;
				}

				// Nút Chat
				const chatBtn = `<button class="btn btn-sm btn-primary ms-2 rounded-pill" onclick="window.goToChat(${product.ID}, ${t.Buyer?.user_ID})"><i class="fas fa-comment-alt"></i> Chat</button>`;

				return `
            <div class="card mb-3 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
                        <small class="text-muted fw-bold">Đơn hàng #${
													t.ID
												} • ${new Date(
					t.created_at
				).toLocaleDateString()}</small>
                        ${statusBadge}
                    </div>
                    <div class="d-flex align-items-center mt-3">
                        <img src="${imgUrl}" class="rounded me-3" style="width: 70px; height: 70px; object-fit: cover; border: 1px solid #eee;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold text-teal">${
															product.name
														}</h6>
                            <p class="mb-0 small text-muted">Khách hàng: <strong class="text-dark">${buyerName}</strong></p>
                            <div class="text-teal fw-bold mt-1" style="font-size:1.1rem">${formatMoney(
															t.final_amount
														)}</div>
                        </div>
                    </div>
                    <div class="mt-3 d-flex justify-content-end">
                        ${actionButtons}
                        ${chatBtn}
                    </div>
                </div>
            </div>
            `;
			})
			.join("");

		container.innerHTML = html;
	} catch (error) {
		console.error(error);
		container.innerHTML =
			'<p class="text-danger text-center">Lỗi tải danh sách đơn hàng</p>';
	}
}

// --- CÁC HÀM HELPER & GLOBAL ---

function createTransactionRow(t) {
	const product = t.Product || {};
	const imgUrl = product.image
		? R2_PUBLIC_URL + product.image
		: "https://placehold.co/50";
	const statusBadge = getStatusBadge(t.status);
	const actionBtn = t.status === "pending_payment" ? "Chờ xử lý" : "Chi tiết";

	return `
    <tr>
        <td>
            <div class="d-flex align-items-center">
                <img src="${imgUrl}" class="product-thumb me-2 rounded" style="width:40px;height:40px;object-fit:cover">
                <div class="text-truncate" style="max-width: 150px;">${
									product.name
								}</div>
            </div>
        </td>
        <td class="fw-bold">${formatMoney(t.final_amount)}</td>
        <td>${statusBadge}</td>
        <td><button class="btn btn-sm btn-light text-muted rounded-pill" disabled>${actionBtn}</button></td>
    </tr>`;
}

function getStatusBadge(status) {
	if (status === "completed")
		return '<span class="badge bg-success">Thành công</span>';
	if (status === "pending_payment")
		return '<span class="badge bg-warning text-dark">Chờ thanh toán</span>';
	if (status === "cancelled" || status === "failed")
		return '<span class="badge bg-danger">Đã hủy</span>';
	return `<span class="badge bg-secondary">${status}</span>`;
}

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount || 0);
}

// --- Gắn hàm vào Window để gọi từ HTML (onclick) ---

window.openSellerCancel = (id) => {
	targetTransactionId = id;
	document.getElementById("seller-cancel-form").reset();
	document.getElementById("seller-reason-text").style.display = "none";
	if (sellerModal) sellerModal.show();
};

window.goToChat = (productId, partnerId) => {
	// Chuyển hướng sang trang chat, truyền ID sản phẩm để lọc ngữ cảnh
	// (Logic này đã được chúng ta thảo luận ở phần Chat)
	console.log(`Chat với user ${partnerId} về sp ${productId}`);
	window.location.href = `../chat/index.html?productId=${productId}`;
};

async function handleCancelOrder() {
	if (!targetTransactionId) return;

	const radio = document.querySelector('input[name="sellerReason"]:checked');
	if (!radio) return alert("Vui lòng chọn lý do hủy!");

	let reason = radio.value;
	if (reason === "other") {
		reason = document.getElementById("seller-reason-text").value.trim();
		if (!reason) return alert("Nhập lý do cụ thể!");
	}

	const btn = document.getElementById("btn-seller-confirm-cancel");
	btn.disabled = true;
	btn.innerText = "Đang xử lý...";

	try {
		await transactionApi.updateTransaction(targetTransactionId, {
			status: "cancelled",
			cancel_reason: `[Shop hủy] ${reason}`,
		});
		alert("Đã hủy đơn hàng.");
		sellerModal.hide();
		loadTransactions(); // Tải lại danh sách
		if (currentUserId) loadDashboardData(currentUserId); // Tải lại thống kê
	} catch (e) {
		alert("Lỗi: " + e.message);
	} finally {
		btn.disabled = false;
		btn.innerText = "Xác nhận Hủy";
	}
}
