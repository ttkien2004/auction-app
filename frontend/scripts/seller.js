// js/seller.js
import productApi from "../services/productApi.js";

// 1. XỬ LÝ CHUYỂN TAB
const tabs = document.querySelectorAll(".tab-btn");
const formDirect = document.getElementById("form-direct");
const formAuction = document.getElementById("form-auction");
let currentType = "DirectSale"; // Mặc định

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		// Update UI Tab
		tabs.forEach((t) => t.classList.remove("active"));
		tab.classList.add("active");

		// Update Biến trạng thái
		const target = tab.dataset.target;
		if (target === "direct") {
			currentType = "DirectSale";
			formDirect.style.display = "block";
			formAuction.style.display = "none";
		} else {
			currentType = "Auction";
			formDirect.style.display = "none";
			formAuction.style.display = "block";
		}
	});
});

// 2. ĐIỀN THÔNG TIN USER TỰ ĐỘNG
document.addEventListener("DOMContentLoaded", () => {
	const userStr = localStorage.getItem("user");
	if (userStr) {
		const user = JSON.parse(userStr);
		document.getElementById("inp-seller").value = user.name || user.email;
	} else {
		alert("Vui lòng đăng nhập để bán hàng!");
		window.location.href = "../auth/index.html";
	}
});

// --- LOGIC DANH MỤC ĐỘNG (Thêm mới) ---
const categoryMap = {
	1: [
		// Điện tử
		{ id: 4, name: "Bàn phím" },
		{ id: 5, name: "Chuột" },
	],
	2: [
		// Thời trang
		{ id: 3, name: "Đồng hồ" },
		{ id: 6, name: "Áo khoác" },
		{ id: 7, name: "Giày" },
		{ id: 8, name: "Túi xách" },
		{ id: 9, name: "Phụ kiện" },
	],
};

const inpParent = document.getElementById("inp-parent-category");
const inpChild = document.getElementById("inp-child-category");

if (inpParent && inpChild) {
	inpParent.addEventListener("change", function () {
		const parentId = this.value;
		const subCategories = categoryMap[parentId] || [];

		// Reset danh mục con
		inpChild.innerHTML =
			'<option value="" selected disabled>-- Chọn chi tiết --</option>';

		if (subCategories.length > 0) {
			inpChild.disabled = false;
			subCategories.forEach((cat) => {
				const option = document.createElement("option");
				option.value = cat.id;
				option.textContent = cat.name;
				inpChild.appendChild(option);
			});
		} else {
			inpChild.disabled = true;
		}
	});
}

// 3. XỬ LÝ SUBMIT FORM
document.getElementById("btn-submit").addEventListener("click", async () => {
	const token = localStorage.getItem("token");
	if (!token) return;

	// Lấy dữ liệu chung
	const name = document.getElementById("inp-name").value;
	const description = document.querySelector(".custom-textarea").value; // Class của textarea mô tả
	const categoryId = document.getElementById("inp-child-category").value;
	const pcondition = document.getElementById("inp-condition").value;
	const fileInput = document.querySelector('.main-upload input[type="file"]');

	if (!name) return alert("Vui lòng nhập tên sản phẩm");
	if (!categoryId) return alert("Vui lòng chọn đầy đủ danh mục sản phẩm");

	// Tạo FormData
	const productData = {
		name: name,
		description,
		category_ID: categoryId,
		pcondition,
		type: currentType,
	};
	const formData = new FormData();
	formData.append("name", name);
	formData.append("description", description);
	formData.append("category_ID", categoryId);
	formData.append("pcondition", pcondition);
	formData.append("type", currentType);

	// Xử lý ảnh

	if (fileInput.files[0]) {
		formData.append("image", fileInput.files[0]);
		productData["file"] = JSON.stringify(fileInput.files[0]);
	}

	// Lấy dữ liệu riêng theo loại
	if (currentType === "DirectSale") {
		const price = document.getElementById("inp-buy-price").value;
		if (!price) return alert("Vui lòng nhập giá bán");
		formData.append("buy_now_price", price);
		productData["buy_now_price"] = price;
	} else {
		// Auction
		const startPrice = document.getElementById("inp-start-price").value;
		const stepPrice = document.getElementById("inp-step-price").value;
		const startTime = document.getElementById("inp-start-time").value;
		const endTime = document.getElementById("inp-end-time").value;

		if (!startPrice || !startTime || !endTime)
			return alert("Vui lòng nhập đủ thông tin đấu giá");

		formData.append("start_price", startPrice);
		formData.append("min_bid_incr", stepPrice || 0);
		formData.append("auc_start_time", new Date(startTime).toISOString());
		formData.append("auc_end_time", new Date(endTime).toISOString());
	}

	// Gửi API
	try {
		document.getElementById("btn-submit").innerText = "Đang xử lý...";
		document.getElementById("btn-submit").disabled = true;

		const response = await productApi.createProduct(formData);

		if (response) {
			const successModalEl = document.getElementById("successModal");
			const successModal = new bootstrap.Modal(successModalEl);

			// 2. Xử lý sự kiện nút "Về trang quản lý"
			const btnRedirect = document.getElementById("btn-redirect-dashboard");

			// Xóa event cũ để tránh bị gán chồng nhiều lần (nếu người dùng ko reload trang)
			const newBtnRedirect = btnRedirect.cloneNode(true);
			btnRedirect.parentNode.replaceChild(newBtnRedirect, btnRedirect);

			newBtnRedirect.addEventListener("click", () => {
				window.location.href = "../seller-dashboard/index.html";
			});

			successModal.show();
		} else {
			const err = await response.json();
			alert("Lỗi: " + err.message);
		}
	} catch (error) {
		console.error(error);
		alert("Lỗi kết nối server");
	} finally {
		document.getElementById("btn-submit").innerText = "ĐĂNG BÁN";
		document.getElementById("btn-submit").disabled = false;
	}
});
