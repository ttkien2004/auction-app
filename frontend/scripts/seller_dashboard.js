import userApi from "../services/userApi.js";
import sellerApi from "../services/sellerApi.js";
import transactionApi from "../services/transactionApi.js";
import productApi from "../services/productApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

// Biến toàn cục
let sellerModal;
let editProductModal;
let editSuccessModal;
let deleteProductModal;
let deleteSuccessModal;

let targetTransactionId = null;
const user = JSON.parse(localStorage.getItem("user" || "{}"));
let currentUserId = user.id;

// --- THÊM BIẾN CHO PHÂN TRANG ---
let allDashboardTransactions = []; // Lưu toàn bộ danh sách để phân trang
let currentDashboardPage = 1;
const dashboardItemsPerPage = 5; // Số dòng mỗi trang

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

	// --- KHỞI TẠO MODAL SỬA ---
	const editEl = document.getElementById("editProductModal");
	if (editEl) editProductModal = new bootstrap.Modal(editEl);

	const successEl = document.getElementById("editSuccessModal");
	if (successEl) editSuccessModal = new bootstrap.Modal(successEl);

	// Gắn sự kiện nút Lưu
	const btnSave = document.getElementById("btn-save-edit");
	if (btnSave) btnSave.addEventListener("click", submitEditProduct);

	// --- KHỞI TẠO MODAL XÓA ---
	const deleteEl = document.getElementById("deleteProductModal");
	if (deleteEl) deleteProductModal = new bootstrap.Modal(deleteEl);

	// Gắn sự kiện cho nút Xác nhận Xóa
	const btnDelete = document.getElementById("btn-confirm-delete");
	if (btnDelete) btnDelete.addEventListener("click", executeDeleteProduct);
	const delSuccessEl = document.getElementById("deleteSuccessModal");
	if (delSuccessEl) deleteSuccessModal = new bootstrap.Modal(delSuccessEl);
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
			// const recentOrders = transactions.slice(0, 5);
			// listContainer.innerHTML = recentOrders
			// 	.map((t) => createTransactionRow(t))
			// 	.join("");
			allDashboardTransactions = transactions || [];
			currentDashboardPage = 1; // Reset về trang 1 mỗi khi tải lại
			renderDashboardTable(); // Gọi hàm render mới
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
                        <button class="btn btn-sm btn-outline-primary" onclick="window.handleEditProduct(${
													p.ID
												})">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.handleDeleteProduct(${
													p.ID
												},'${p.name}')">Xóa</button>
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
// --- HÀM RENDER BẢNG PHÂN TRANG ---
function renderDashboardTable() {
	const listContainer = document.getElementById("dashboard-order-list");
	const paginationContainer = document.getElementById("dashboard-pagination");

	if (!listContainer) return;

	// 1. Kiểm tra dữ liệu rỗng
	if (allDashboardTransactions.length === 0) {
		listContainer.innerHTML =
			'<tr><td colspan="4" class="text-center py-4 text-muted">Chưa có đơn hàng nào.</td></tr>';
		paginationContainer.innerHTML = "";
		return;
	}

	// 2. Cắt dữ liệu theo trang
	const startIndex = (currentDashboardPage - 1) * dashboardItemsPerPage;
	const endIndex = startIndex + dashboardItemsPerPage;
	const pageData = allDashboardTransactions.slice(startIndex, endIndex);

	// 3. Render các dòng dữ liệu
	listContainer.innerHTML = pageData
		.map((t) => createTransactionRow(t)) // Hàm này bạn đã có sẵn ở dưới
		.join("");

	// 4. Render nút phân trang
	renderPaginationControls();
}

function renderPaginationControls() {
	const paginationContainer = document.getElementById("dashboard-pagination");
	const totalPages = Math.ceil(
		allDashboardTransactions.length / dashboardItemsPerPage
	);

	if (totalPages <= 1) {
		paginationContainer.innerHTML = ""; // Không cần phân trang nếu ít dữ liệu
		return;
	}

	let html = "";

	// Nút Previous
	const prevDisabled = currentDashboardPage === 1 ? "disabled" : "";
	html += `
        <li class="page-item ${prevDisabled}">
            <button class="page-link" onclick="changeDashboardPage(${
							currentDashboardPage - 1
						})" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </button>
        </li>
    `;

	// Các nút số trang
	for (let i = 1; i <= totalPages; i++) {
		const activeClass = currentDashboardPage === i ? "active" : "";
		// Lưu ý: class 'bg-teal' border-teal để đồng bộ màu xanh của bạn
		const style =
			currentDashboardPage === i
				? "background-color: #00897B; border-color: #00897B; color: white;"
				: "color: #00897B;";

		html += `
            <li class="page-item ${activeClass}">
                <button class="page-link" style="${style}" onclick="changeDashboardPage(${i})">${i}</button>
            </li>
        `;
	}

	// Nút Next
	const nextDisabled = currentDashboardPage === totalPages ? "disabled" : "";
	html += `
        <li class="page-item ${nextDisabled}">
            <button class="page-link" onclick="changeDashboardPage(${
							currentDashboardPage + 1
						})" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </button>
        </li>
    `;

	paginationContainer.innerHTML = html;
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

window.changeDashboardPage = (newPage) => {
	const totalPages = Math.ceil(
		allDashboardTransactions.length / dashboardItemsPerPage
	);

	if (newPage < 1 || newPage > totalPages) return;

	currentDashboardPage = newPage;
	renderDashboardTable();
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

// --- LOGIC SỬA SẢN PHẨM ---

// 1. Mở Modal và Điền dữ liệu
window.handleEditProduct = async (id) => {
	try {
		// Gọi API lấy chi tiết sản phẩm
		const product = await productApi.getProductById(id); // Hàm này bạn đã có trong context ProductService

		// Điền dữ liệu vào Form
		document.getElementById("edit-product-id").value = product.ID;
		document.getElementById("edit-product-type").value = product.type;
		document.getElementById("edit-name").value = product.name;
		document.getElementById("edit-desc").value = product.description || "";
		document.getElementById("edit-condition").value =
			product.pcondition || "Đã qua sử dụng";

		// Xử lý giá & Label dựa trên loại sản phẩm
		const priceInput = document.getElementById("edit-price");
		const priceLabel = document.getElementById("edit-price-label");

		if (product.type === "Auction") {
			priceLabel.innerText = "Giá khởi điểm (VNĐ)";
			priceInput.value = product.Auction?.start_price || 0;
		} else {
			priceLabel.innerText = "Giá bán ngay (VNĐ)";
			priceInput.value = product.DirectSale?.buy_now_price || 0;
		}

		// Xử lý trạng thái switch
		document.getElementById("edit-status").checked =
			product.status === "active";

		// Hiện Modal
		if (editProductModal) editProductModal.show();
	} catch (error) {
		console.error(error);
		alert("Lỗi tải thông tin sản phẩm: " + error.message);
	}
};

// 2. Gửi dữ liệu lên Server
async function submitEditProduct() {
	console.log("Hello");
	const btn = document.getElementById("btn-save-edit");
	const id = document.getElementById("edit-product-id").value;
	const type = document.getElementById("edit-product-type").value;

	// Thu thập dữ liệu
	const updateData = {
		name: document.getElementById("edit-name").value,
		description: document.getElementById("edit-desc").value,
		pcondition: document.getElementById("edit-condition").value,
		status: document.getElementById("edit-status").checked
			? "active"
			: "inactive",
	};

	// Lấy giá tùy theo loại
	const priceVal = document.getElementById("edit-price").value;
	if (type === "Auction") {
		updateData.start_price = priceVal;
	} else {
		updateData.buy_now_price = priceVal;
	}

	// UX: Loading
	btn.disabled = true;
	btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';

	try {
		// Gọi API Update (Map với ProductService.updateProduct bên Backend)
		await sellerApi.updateProduct(id, updateData);

		// 1. Ẩn Modal Sửa
		editProductModal.hide();

		// 2. Hiện Modal Thành Công
		editSuccessModal.show();

		// 3. Tải lại danh sách sản phẩm để cập nhật giao diện
		loadProducts();
	} catch (error) {
		console.error(error);
		alert("Lỗi cập nhật: " + error.message);
	} finally {
		// Reset nút
		btn.disabled = false;
		btn.innerHTML = '<i class="fas fa-save me-1"></i> Lưu thay đổi';
	}
}

// Hàm này được gọi khi bấm nút "Xóa" trên danh sách
window.handleDeleteProduct = (id, name) => {
	// 1. Lưu ID vào hidden input
	document.getElementById("hidden-delete-id").value = id;

	// 2. Hiển thị tên sản phẩm lên modal cho người dùng dễ nhìn
	document.getElementById("delete-product-name").innerText = `${name}`;

	// 3. Hiện Modal
	if (deleteProductModal) deleteProductModal.show();
};
// Hàm thực thi gọi API
async function executeDeleteProduct() {
	const btn = document.getElementById("btn-confirm-delete");
	const id = document.getElementById("hidden-delete-id").value;

	if (!id) return;

	// UX: Hiệu ứng loading
	const originalText = btn.innerHTML;
	btn.disabled = true;
	btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';

	try {
		// Dựa vào code route backend bạn cung cấp trước đó:
		// routes.patch("/seller/products/:id", ...) -> Dùng PATCH để xóa
		// Bạn cần đảm bảo sellerApi.deleteProduct gọi đúng method PATCH hoặc DELETE tùy backend
		await sellerApi.deleteProduct(id);

		// 1. Ẩn Modal
		deleteProductModal.hide();

		// 2. Load lại danh sách sản phẩm
		loadProducts();

		// 3. Thông báo (Có thể dùng lại Modal Success hoặc alert nhỏ)
		if (deleteSuccessModal) deleteSuccessModal.show();
		// alert("Đã xóa sản phẩm thành công!");
	} catch (error) {
		console.error(error);
		alert("Lỗi khi xóa: " + error.message);
	} finally {
		// Reset nút
		btn.disabled = false;
		btn.innerHTML = originalText;
	}
}
