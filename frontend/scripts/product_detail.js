import productApi from "../services/productApi.js";
import cartApi from "../services/cartApi.js";
import chatApi from "../services/chatApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";
const socket = io("http://localhost:3000");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const btnChatNow = document.getElementById("btn-chat-now");

document.addEventListener("DOMContentLoaded", async () => {
	if (!productId) return alert("Không tìm thấy sản phẩm");

	await loadProductData();
	checkLogin();
});

async function loadProductData() {
	try {
		const response = await productApi.getProductById(productId);
		const product = response.data || response;

		// 1. Điền thông tin chung
		document.getElementById("product-name").innerText = product.name;
		document.getElementById("product-desc").innerText = product.description;
		document.getElementById("product-code").innerText = `DS-${product.ID}`;
		document.getElementById("product-condition").innerText =
			product.pcondition || "Đã qua sử dụng";
		document.getElementById("created-at").innerText = new Date(
			product.created_at
		).toLocaleDateString();

		// 2. Điền thông tin người bán
		if (product.Seller && product.Seller.User) {
			document.getElementById("seller-name").innerText =
				product.Seller.User.name;
			document.getElementById("product-location").innerText =
				product.Seller.User.address || "Toàn quốc";
			// document.getElementById('seller-avatar').src = ...
		}

		// 3. Điền giá (Quan trọng)
		if (product.DirectSale) {
			const price = product.DirectSale.buy_now_price;
			document.getElementById("product-price").innerText = formatMoney(price);
		} else {
			alert("Đây là sản phẩm đấu giá, vui lòng sang trang đấu giá.");
			window.location.href = `auction/detail.html?id=${productId}`;
		}

		// Xử lý ảnh
		document.getElementById("product-image").src =
			R2_PUBLIC_URL + product?.image || "https://placehold.co/400x400";
	} catch (error) {
		console.error(error);
		alert("Lỗi tải dữ liệu");
	}
}

// --- SỰ KIỆN NÚT BẤM ---

// 1. Thêm vào giỏ hàng
document
	.getElementById("btn-add-to-cart")
	.addEventListener("click", async () => {
		if (!checkLogin(true)) return;

		try {
			// Gọi API Cart (Turn #104)
			await cartApi.addToCart({ productId: Number(productId) });
			alert("Đã thêm vào giỏ hàng thành công!");
		} catch (error) {
			alert(error.message || "Lỗi thêm vào giỏ");
		}
	});

// 2. Mua ngay -> Mở modal giao hàng (Turn #110)
document.getElementById("btn-buy-now").addEventListener("click", () => {
	if (!checkLogin(true)) return;

	// Logic mở modal giao hàng mà chúng ta đã bàn ở turn #110
	// const shippingModal = new bootstrap.Modal...
	// shippingModal.show();
	alert("Chức năng Mua Ngay đang được tích hợp (Mở modal giao hàng)...");
});

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

function checkLogin(redirect = false) {
	const token = localStorage.getItem("token");
	if (token) {
		// Render avatar header...
		return true;
	}
	if (redirect) window.location.href = "../auth/index.html";
	return false;
}

btnChatNow.addEventListener("click", async () => {
	try {
		// 1. Gọi API để lấy/tạo conversation
		const conversation = await chatApi.getConversationByProductId(productId);
		console.log(conversation);
		if (!conversation) throw new Error("Không thể tạo cuộc trò chuyện mới");

		const roomId = conversation.ID;

		// 2. Tự động Join Socket (Không cần nhập tay nữa)
		socket.emit("join_chat", roomId);

		// // 3. Chuyển giao diện sang màn hình chat
		// console.log(`Đã vào phòng chat #${roomId} thành công!`);
		window.location.href = `../chat/index.html?productId=${productId}`;
	} catch (error) {
		console.log(error);
		alert("Lỗi: " + error.message);
	}
});
