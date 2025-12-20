import cartApi from "../services/cartApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

// DOM Elements
const cartListEl = document.getElementById("cart-list");
const subtotalEl = document.getElementById("subtotal-price");
const totalEl = document.getElementById("total-price");
const authSection = document.getElementById("auth-section");
const countCartList = document.getElementById("count-cart-list");

// State
let cartItems = [];

document.addEventListener("DOMContentLoaded", async () => {
	// 1. Check Login & Render Avatar (Giống các trang khác)
	checkLogin();

	// 2. Load Giỏ Hàng
	await loadCart();
});

async function loadCart() {
	cartListEl.innerHTML = '<p class="text-center">Đang tải...</p>';
	try {
		const response = await cartApi.getCart(); // GET /api/cart
		console.log(response);
		cartItems = response.data || response; // Tùy cấu trúc trả về

		countCartList.innerText = response.length;
		renderCart();
		calculateTotal();
	} catch (error) {
		console.error(error);
		cartListEl.innerHTML =
			'<p class="text-center text-danger">Lỗi tải giỏ hàng. Vui lòng thử lại.</p>';
	}
}

function renderCart() {
	if (cartItems.length === 0) {
		cartListEl.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
                <p>Giỏ hàng của bạn đang trống.</p>
                <a href="../index.html" class="btn btn-outline-success rounded-pill">Đi mua sắm ngay</a>
            </div>
        `;
		// Disable nút thanh toán
		document.getElementById("btn-checkout").disabled = true;
		document.getElementById("btn-checkout").style.opacity = "0.5";
		return;
	}

	const html = cartItems
		.map((item) => {
			const product = item.Product;
			const price = product.DirectSale?.buy_now_price || 0;
			const imgUrl = product.image
				? `${R2_PUBLIC_URL}${product.image}`
				: "https://placehold.co/100"; // Thay URL R2 của bạn

			return `
        <div class="cart-item" id="item-${product.ID}">
            <img src="${imgUrl}" class="item-img" alt="${product.name}">
            
            <div class="item-info">
                <a href="../html/product-detail.html?id=${
									product.ID
								}" class="item-name d-block">${product.name}</a>
                <div class="item-seller">Người bán: ${
									product.Seller?.User?.name || "Unknown"
								}</div>
            </div>

            <div class="text-end ms-3">
                <div class="item-price mb-2">${formatMoney(price)}</div>
				<button class="btn btn-success btn-sm rounded-pill" onclick="goToCheckout(${
					product.ID
				})">
                    Mua ngay
                </button>
                <button class="btn-remove" onclick="removeItem(${product.ID})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
        `;
		})
		.join("");

	cartListEl.innerHTML = html;
	document.getElementById("btn-checkout").disabled = false;
	document.getElementById("btn-checkout").style.opacity = "1";
}

function calculateTotal() {
	const total = cartItems.reduce((sum, item) => {
		const price = Number(item.Product.DirectSale?.buy_now_price || 0);
		return sum + price;
	}, 0);

	const formatted = formatMoney(total);
	subtotalEl.innerText = formatted;
	totalEl.innerText = formatted;
}

// Hàm xóa item (Gắn vào window để gọi từ onclick HTML)
window.removeItem = async (productId) => {
	if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

	try {
		await cartApi.removeFromCart(productId); // DELETE /api/cart/:id

		// Xóa khỏi mảng local và render lại (đỡ phải gọi lại API getCart)
		cartItems = cartItems.filter((item) => item.Product.ID !== productId);

		// Hiệu ứng xóa UI
		const el = document.getElementById(`item-${productId}`);
		if (el) el.remove();

		calculateTotal();

		// Nếu hết hàng thì render lại trạng thái trống
		if (cartItems.length === 0) renderCart();
	} catch (error) {
		alert("Lỗi xóa sản phẩm: " + error.message);
	}
};

// Xử lý nút Thanh toán
document.getElementById("btn-checkout").addEventListener("click", () => {
	if (cartItems.length === 0) return;
	// Chuyển hướng sang trang Checkout (hoặc flow thanh toán từng món)
	// Vì logic C2C thường mua từng món, bạn có thể lặp qua để tạo nhiều đơn,
	// hoặc chọn 1 món để thanh toán. Ở đây tạm alert.
	alert(
		"Tính năng Thanh toán hàng loạt đang phát triển. Vui lòng mua từng món tại trang chi tiết."
	);
});

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

function checkLogin() {
	const userStr = localStorage.getItem("user");
	const token = localStorage.getItem("token");
	if (!token || !userStr) {
		alert("Vui lòng đăng nhập để xem giỏ hàng");
		window.location.href = "../auth/index.html";
		return;
	}
}
window.goToCheckout = (productId) => {
	// Chuyển sang trang xác nhận đơn hàng kèm ID sản phẩm
	window.location.href = `../order-confirmation/index.html?productId=${productId}`;
};
