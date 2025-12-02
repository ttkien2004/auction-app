// TODO: Dùng file này cho việc gọi đến các Api services
import { BASE_URL, R2_PUBLIC_URL } from "../services/apiHelpers.js";
import buyerApi from "../services/buyerApi.js";
import MoMoApi from "../services/MoMoApi.js";
// import directSalesApi from "../services/directSalesApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const buyerTransactions = await buyerApi.getBuyerTransactions();
		const transactionListContainer =
			document.getElementById("transaction-list");
		let transactionList = "";
		let statusLabel = "";
		let actionButtons = "";

		buyerTransactions.forEach((transaction) => {
			const product = transaction.Product ?? {};
			const sellerName = product?.Seller?.User?.name ?? "Người bán";
			const expectedDelivery =
				transaction?.expected_delivery_date ??
				product?.Transaction?.expected_delivery_date;
			const statusText = expectedDelivery ? "ĐANG GIAO HÀNG" : "";
			const priceValue =
				transaction?.final_amount ?? product?.Transaction?.final_amount ?? 0;

			const priceFormatted = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(Number(priceValue));

			const productName = product?.name ?? "Sản phẩm";
			const productId = product?.ID ?? 0;
			const imgURl = R2_PUBLIC_URL + product?.image;

			const transactionStatus = product?.Transaction?.status ?? "";

			if (transactionStatus === "completed") {
				statusLabel =
					'<p class="product-status status-success mb-1">THÀNH CÔNG</p>';
				actionButtons =
					'<button class="btn btn-outline-secondary btn-sm">Đánh giá</button>';
			} else if (
				transactionStatus === "failed" ||
				transactionStatus === "cancelled"
			) {
				statusLabel =
					'<p class="product-status status-cancel mb-1">HỦY ĐƠN</p>';
				actionButtons =
					'<button class="btn btn-outline-primary btn-sm">Mua lại</button>';
			} else if (transactionStatus === "pending_payment") {
				statusLabel =
					'<p class="product-status status-pending mb-1">CHỜ THANH TOÁN</p>';

				// Nút này sẽ gọi lại API MoMo cho Transaction cũ
				actionButtons = `
            <button class="btn btn-danger btn-sm fw-bold" onclick="retryPayment(${transaction.ID})">
                Thanh toán ngay
            </button>
            <button class="btn btn-outline-secondary btn-sm" onclick="cancelOrder(${transaction.ID})">
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
                            <button class="btn btn-view" onclick="goToProductDetail(${productId})">Xem sản phẩm</button>
                            <button class="btn btn-outline-custom" onclick="goToChat(${productId})">Liên lạc người bán</button>
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
		console.error("Lỗi khi tải dữ liệu người mua:", err);
	}
});
window.goToChat = (productId) => {
	window.location.href = `../chat/index.html?productId=${productId}`;
};
window.goToProductDetail = (productId) => {
	window.location.href = `../product-detail/index.html?id=${productId}`;
};
window.retryPayment = async (transactionId) => {
	try {
		// Gọi trực tiếp API tạo link MoMo (không cần tạo Transaction mới)
		const data = await MoMoApi.createPayment(transactionId);

		if (data.body && data.body.payUrl) {
			// Chuyển hướng lại sang MoMo
			window.location.href = data.body.payUrl;
		} else {
			alert("Lỗi lấy link thanh toán");
		}
	} catch (error) {
		console.error(error);
		alert("Có lỗi xảy ra");
	}
};
