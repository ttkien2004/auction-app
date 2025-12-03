// TODO: Dùng file này cho việc gọi đến các Api services
import { BASE_URL, R2_PUBLIC_URL } from "../services/apiHelpers.js";
// import buyerApi from "../services/buyerApi.js";
import sellerApi from "../services/sellerApi.js";
import MoMoApi from "../services/MoMoApi.js";
import transactionApi from "../services/transactionApi.js";
// import directSalesApi from "../services/directSalesApi.js";

// Biến toàn cục
let targetTransactionId = null;
let sellerModal; // Sẽ khởi tạo trong DOMContentLoaded

document.addEventListener("DOMContentLoaded", async () => {
	// Khởi tạo Modal
	const modalEl = document.getElementById("cancelSellerModal");
	if (modalEl) {
		sellerModal = new bootstrap.Modal(modalEl);
	}
	try {
		const sellerTransactions = await sellerApi.getSellerTransactions();
		const transactionListContainer =
			document.getElementById("transaction-list");
		let transactionList = "";
		let statusLabel = "";
		let actionButtons = "";

		console.log(sellerTransactions[0]);
		sellerTransactions.forEach((transaction) => {
			const product = transaction.Product ?? {};
			const sellerName = product?.Seller?.User?.name ?? "Người bán";
			const expectedDelivery =
				transaction?.expected_delivery_date ??
				product?.Transaction?.expected_delivery_date;

			const priceValue =
				transaction?.final_amount ?? product?.Transaction?.final_amount ?? 0;

			const priceFormatted = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(Number(priceValue));

			const productName = product?.name ?? "Sản phẩm";
			const productId = product?.ID ?? 0;
			const imgURl = R2_PUBLIC_URL + product?.image;

			const transactionStatus = transaction?.status ?? "";
			if (transactionStatus === "completed") {
				statusLabel =
					'<p class="product-status status-success mb-1">THÀNH CÔNG</p>';
				actionButtons =
					'<button class="btn btn-outline-secondary btn-sm">Xem Đánh giá</button>';
			} else if (
				transactionStatus === "failed" ||
				transactionStatus === "cancelled"
			) {
				statusLabel =
					'<p class="product-status status-cancel mb-1">HỦY ĐƠN</p>';
				actionButtons =
					'<button class="btn btn-outline-secondary btn-sm">Xem Đánh giá</button>';
			} else if (transactionStatus === "pending_payment") {
				statusLabel =
					'<p class="product-status status-pending mb-1">CHỜ THANH TOÁN</p>';

				actionButtons = `
            <button class="btn btn-outline-secondary btn-sm" onclick="openSellerCancel(${transaction.ID})">
                Hủy đơn
            </button>
        `;
			}

			transactionList += `<div class="product-card d-flex align-items-center">
                        <img
                            src="${imgURl}"
                            class="rounded me-4"
                            alt="Product"
							style="width: 120px; height: 120px; object-fit: contain;"
                        />
                        <div class="flex-grow-1">
                            <h5 class="product-title">${productName}</h5>
                            ${statusLabel}
                            <p class="text-muted small mb-1">${sellerName}</p>
                            <h4 class="product-price">${priceFormatted}</h4>
                        </div>
                        <div class="d-flex align-items-end gap-2">
                            <button class="btn btn-view">Xem sản phẩm</button>
                        </div>
						<div class="d-flex flex-column gap-2" style="margin-left: 10px;">
							${actionButtons}
						</div>
                    </div>`;
		});
		if (!transactionList) {
			transactionList = '<p class="text-muted">Không có giao dịch.</p>';
		}
		transactionListContainer.insertAdjacentHTML("beforeend", transactionList);
	} catch (err) {
		console.error("Lỗi khi tải dữ liệu người bán:", err);
	}
});
window.goToChat = (productId) => {
	window.location.href = `../chat/index.html?productId=${productId}`;
};
// window.goToProductDetail = (productId) => {
// 	window.location.href = `../product-detail/index.html?id=${productId}`;
// };
// 1. Hàm mở Modal (Gắn vào nút "Hủy" trên danh sách)
window.openSellerCancel = (transactionId) => {
	targetTransactionId = transactionId;

	// Reset form
	document.getElementById("seller-cancel-form").reset();
	document.getElementById("seller-other-reason").style.display = "none";

	sellerModal.show();
};

// 2. Xử lý ẩn/hiện ô "Lý do khác"
const sellerRadios = document.querySelectorAll('input[name="sellerReason"]');
sellerRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		const otherBox = document.getElementById("seller-other-reason");
		if (e.target.value === "other") {
			otherBox.style.display = "block";
		} else {
			otherBox.style.display = "none";
		}
	});
});

// 3. Xử lý nút Xác nhận Hủy
document
	.getElementById("btn-seller-confirm-cancel")
	.addEventListener("click", async () => {
		if (!targetTransactionId) return;

		const selectedRadio = document.querySelector(
			'input[name="sellerReason"]:checked'
		);
		if (!selectedRadio) {
			alert("Vui lòng chọn lý do!");
			return;
		}

		let reason = selectedRadio.value;
		if (reason === "other") {
			reason = document.getElementById("seller-reason-text").value.trim();
			if (!reason) return alert("Vui lòng nhập lý do cụ thể!");
		}

		// Thêm tiền tố [Người bán hủy] để dễ phân biệt trong DB
		const finalReason = `[Người bán hủy] ${reason}`;

		await cancelTransaction(targetTransactionId, finalReason);
	});

// 4. Gọi API Hủy (Tái sử dụng logic API PUT)
async function cancelTransaction(id, reason) {
	const btn = document.getElementById("btn-seller-confirm-cancel");
	btn.disabled = true;
	btn.innerText = "Đang xử lý...";

	try {
		const token = localStorage.getItem("token");
		const response = await transactionApi.updateTransaction(id, {
			status: "cancelled",
			cancel_reason: reason,
		});

		if (response) {
			alert("Đã hủy đơn hàng.");
			sellerModal.hide();
			// loadTransactions(); // Gọi lại hàm load danh sách để cập nhật UI
			window.location.reload();
		} else {
			const data = await response.json();
			alert("Lỗi: " + data.message);
		}
	} catch (error) {
		console.error(error);
		alert("Lỗi kết nối server");
	} finally {
		btn.disabled = false;
		btn.innerText = "Xác nhận Hủy";
	}
}
