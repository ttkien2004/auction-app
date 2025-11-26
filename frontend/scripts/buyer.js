// TODO: Dùng file này cho việc gọi đến các Api services
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";
import buyerApi from "../services/buyerApi.js";
// import directSalesApi from "../services/directSalesApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const buyerTransactions = await buyerApi.getBuyerTransactions();
		console.log("Giao dịch của người mua:", buyerTransactions);
		const transactionListContainer =
			document.getElementById("transaction-list");
		let transactionList = "";
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
			const imgURl = R2_PUBLIC_URL + product?.image;

			transactionList += `<div class="product-card d-flex align-items-center">
                        <img
                            src="${imgURl}"
                            class="rounded me-4"
                            alt="Product"
							style="width: 120px; height: 120px; object-fit: contain;"
                        />
                        <div class="flex-grow-1">
                            <h5 class="product-title">${productName}</h5>
                            <p class="product-status status-shipping mb-1">${statusText}</p>
                            <p class="text-muted small mb-1">${sellerName}</p>
                            <h4 class="product-price">${priceFormatted}</h4>
                        </div>
                        <div class="d-flex align-items-end gap-2">
                            <button class="btn btn-view">Xem sản phẩm</button>
                            <button class="btn btn-outline-custom">Liên lạc người bán</button>
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
