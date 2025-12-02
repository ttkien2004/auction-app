// TODO: Dùng file này cho việc gọi đến các Api services
import sellerApi from "../services/sellerApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const sellerProducts = await sellerApi.getSellerProducts();
		const productListContainer = document.getElementById(
			"seller-products-list"
		);
		let productList = "";
		console.log(sellerProducts);
		sellerProducts.forEach((product) => {
			const productName = product?.name ?? "Sản phẩm";
			const productType = product?.type ?? "Loại sản phẩm";
			const productId = product?.ID ?? "";
			productList += `
            <div class="product-card d-flex">
                <img
                    src="https://placehold.co/120x120/black/white?text=Ao"
                    class="rounded me-4"
                    alt="Product"
                />
                <div class="flex-grow-1">
                    <h5 class="product-title">${productName}</h5>
                    <p class="product-id mb-1">AOC_${productId}</p>
                    <p class="product-time mb-1">
                        21/10/2025 08:00 - 28/10/2025 17:00
                    </p>
                    <p class="product-time">31/10/2025 10:00 - 10:30</p>
                </div>
                <div class="d-flex">
                    <div style="display: flex; flex-direction: row; align-items: end">
                        <button class="btn btn-view">Xem sản phẩm</button>
                        <button class="btn btn-action">Thay đổi thông tin</button>
                    </div>
                </div>
            </div>
            `;
		});
		if (!productList) {
			productList = '<p class="text-muted">Không có sản phẩm nào.</p>';
		}
		productListContainer.insertAdjacentHTML("beforeend", productList);
	} catch (err) {
		console.error("Lỗi khi tải dữ liệu người bán:", err);
	}
});
