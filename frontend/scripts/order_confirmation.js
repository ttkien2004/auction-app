import productApi from "../services/productApi.js";
import userApi from "../services/userApi.js";
import paymentApi from "../services/paymentApi.js";
import directSalesApi from "../services/directSales.js";
import { BASE_URL, R2_PUBLIC_URL } from "../services/apiHelpers.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");
let productData = null;
let shipFee = 0;
// Biến lưu trữ địa chỉ đã chọn (để gửi đi tính phí)
let selectedLocation = {
	province_id: null,
	district_id: null,
	ward_code: null,
};
// DOM Elements cho địa chỉ
const provinceSelect = document.getElementById("province-select");
const districtSelect = document.getElementById("district-select");
const wardSelect = document.getElementById("ward-select");
const expectedDateEl = document.getElementById("expected-date");

document.addEventListener("DOMContentLoaded", async () => {
	if (!productId) return alert("Lỗi: Không có sản phẩm");

	await loadInfo();
	setupAddressListeners();
});

async function loadInfo() {
	try {
		// 1. Lấy thông tin sản phẩm
		const resProd = await productApi.getProductById(productId);
		productData = resProd.data || resProd;

		// Render UI
		document.getElementById("product-name").innerText = productData.name;
		document.getElementById("seller-name").innerText =
			productData.Seller?.User?.name;

		const price = Number(productData.DirectSale?.buy_now_price || 0);
		const formattedPrice = formatMoney(price);

		document.getElementById("product-price").innerText = formattedPrice;
		document.getElementById("cost-item").innerText = formattedPrice;

		if (productData.image) {
			document.getElementById("product-img").src =
				R2_PUBLIC_URL + productData.image;
		}

		// 2. Lấy thông tin User (để điền sẵn form)
		const resUser = await userApi.getUserProfile();
		const user = resUser.profile;
		document.getElementById("shipping-name").value = user.username || "";
		document.getElementById("shipping-phone").value = user.phone_number || "";
		document.getElementById("shipping-address").value = user.address || "";
		// Bước 1: Tải danh sách Tỉnh
		await loadProvinces();

		// Bước 2: Nếu user có ID Tỉnh -> Gán và tải Huyện
		if (user.ghn_province_id) {
			provinceSelect.value = user.ghn_province_id;
			selectedLocation.province_id = user.ghn_province_id;

			// Tải danh sách Huyện theo Tỉnh này
			await loadDistricts(user.ghn_province_id);

			// Bước 3: Nếu user có ID Huyện -> Gán và tải Xã
			if (user.ghn_district_id) {
				districtSelect.value = user.ghn_district_id;
				selectedLocation.district_id = user.ghn_district_id;

				// Tải danh sách Xã theo Huyện này
				await loadWards(user.ghn_district_id);

				// Bước 4: Nếu user có Mã Xã -> Gán và Tính phí
				if (user.ghn_ward_code) {
					wardSelect.value = user.ghn_ward_code;
					selectedLocation.ward_code = user.ghn_ward_code;

					// Tự động tính phí ship
					await calculateShippingFee();
				}
			}
		}

		updateTotal(window.shipFee || 0);
	} catch (error) {
		console.error(error);
		alert("Lỗi tải thông tin");
	}
}

function updateTotal(shipFee) {
	const itemPrice = Number(productData.DirectSale?.buy_now_price || 0);
	const total = itemPrice + shipFee;
	document.getElementById("total-payment").innerText = formatMoney(total);
}

// XỬ LÝ NÚT THANH TOÁN
document.getElementById("btn-pay-momo").addEventListener("click", async () => {
	const btn = document.getElementById("btn-pay-momo");
	btn.disabled = true;
	btn.innerText = "Đang xử lý...";
	if (
		!selectedLocation.province_id ||
		!selectedLocation.district_id ||
		!selectedLocation.ward_code
	) {
		alert("Vui lòng chọn đầy đủ địa chỉ giao hàng!");
		return;
	}

	try {
		// 1. Gọi API tạo Transaction (DirectSales/buy)
		// API này cần body: address, phone, to_district_id...
		const token = localStorage.getItem("token");

		// (Giả sử bạn đã chọn xong địa chỉ và có ID)
		const shippingBody = {
			address: document.getElementById("shipping-address").value,
			phone: document.getElementById("shipping-phone").value,
			note: document.getElementById("shipping-note").value,
			to_district_id: selectedLocation.district_id, // (Lấy từ dropdown thực tế)
			to_ward_code: selectedLocation.ward_code, // (Lấy từ dropdown thực tế)
			to_province_id: selectedLocation.province_id,
			shipping_fee: window.shipFee || 0,
		};

		// Tạo Transaction trước
		const transRes = await directSalesApi.buyDirectSale(
			productId,
			JSON.stringify(shippingBody)
		);
		// const transRes = await fetch(
		// 	`http://localhost:3000/api/direct-sales/buy?id=${productId}`,
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 		body: JSON.stringify(shippingBody),
		// 	}
		// );

		// const transData = await transRes.json();
		const transData = transRes;
		if (!transRes) throw new Error(transData.message);

		const transactionId = transData.transaction.ID;

		// 2. Gọi API tạo link MoMo
		const momoRes = await paymentApi.createMoMoPayment(
			JSON.stringify({ transactionId })
		);

		// 3. Redirect sang MoMo
		if (momoRes.body && momoRes.body.payUrl) {
			window.location.href = momoRes.body.payUrl;
		} else {
			throw new Error("Không lấy được link thanh toán");
		}
	} catch (error) {
		alert("Lỗi: " + error.message);
		btn.disabled = false;
		btn.innerText = "Thanh toán qua MoMo";
	}
});

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

const API_LOCATION_URL = `${BASE_URL}/shipping/location`;
const API_CALCULATE_FEE = `${BASE_URL}/shipping/calculate-fee`;

/**
 * Hàm khởi tạo các sự kiện lắng nghe cho Dropdown địa chỉ
 */
async function setupAddressListeners() {
	// 1. Tải danh sách Tỉnh/Thành phố ngay khi load trang
	await loadProvinces();

	// 2. Sự kiện khi chọn Tỉnh -> Tải Huyện
	provinceSelect.addEventListener("change", async (e) => {
		const provinceId = e.target.value;
		selectedLocation.province_id = Number(provinceId);

		// Reset Huyện và Xã
		resetSelect(districtSelect, "Quận/Huyện");
		resetSelect(wardSelect, "Phường/Xã");

		if (provinceId) {
			await loadDistricts(provinceId);
		}
	});

	// 3. Sự kiện khi chọn Huyện -> Tải Xã
	districtSelect.addEventListener("change", async (e) => {
		const districtId = e.target.value;
		selectedLocation.district_id = Number(districtId);

		// Reset Xã
		resetSelect(wardSelect, "Phường/Xã");

		if (districtId) {
			await loadWards(districtId);
		}
	});

	// 4. Sự kiện khi chọn Xã -> TÍNH PHÍ SHIP
	wardSelect.addEventListener("change", async (e) => {
		const wardCode = e.target.value;
		selectedLocation.ward_code = wardCode;

		if (wardCode) {
			await calculateShippingFee();
		}
	});
}

// --- CÁC HÀM HELPER GỌI API ---

async function loadProvinces() {
	try {
		const response = await fetch(`${API_LOCATION_URL}?type=province`);
		const data = await response.json();

		// GHN trả về mảng: [{ ProvinceID: 202, ProvinceName: "Hồ Chí Minh", ... }]
		populateSelect(provinceSelect, data, "ProvinceID", "ProvinceName");
	} catch (error) {
		console.error("Lỗi tải Tỉnh/Thành:", error);
	}
}

async function loadDistricts(provinceId) {
	try {
		const response = await fetch(
			`${API_LOCATION_URL}?type=district&parentId=${provinceId}`
		);
		const data = await response.json();

		// GHN trả về: [{ DistrictID: 1442, DistrictName: "Quận 1", ... }]
		populateSelect(districtSelect, data, "DistrictID", "DistrictName");
	} catch (error) {
		console.error("Lỗi tải Quận/Huyện:", error);
	}
}

async function loadWards(districtId) {
	try {
		const response = await fetch(
			`${API_LOCATION_URL}?type=ward&parentId=${districtId}`
		);
		const data = await response.json();

		// GHN trả về: [{ WardCode: "20301", WardName: "Phường Bến Nghé", ... }]
		populateSelect(wardSelect, data, "WardCode", "WardName");
	} catch (error) {
		console.error("Lỗi tải Phường/Xã:", error);
	}
}

// --- HÀM TÍNH PHÍ VẬN CHUYỂN ---
async function calculateShippingFee() {
	const costShipEl = document.getElementById("cost-ship");
	const totalEl = document.getElementById("total-payment");

	costShipEl.innerText = "Đang tính...";

	try {
		// Lấy thông tin sản phẩm để biết ID kho người bán (from_district_id)
		// (Lưu ý: productData đã được load ở hàm loadInfo() trong file chính)
		if (!productData || !productData.Seller) {
			throw new Error("Chưa có thông tin sản phẩm");
		}

		// Giả sử Backend API Product trả về ghn_district_id của Seller
		// Nếu chưa có, bạn cần update API getProductById để include User.ghn_district_id
		const fromDistrictId = productData.Seller.User.ghn_district_id || 1454; // 1454 là Quận 12 (Fallback)

		const payload = {
			from_district_id: fromDistrictId,
			to_district_id: selectedLocation.district_id,
			to_ward_code: selectedLocation.ward_code,
			insurance_value: Number(productData.DirectSale?.buy_now_price || 0),
			to_province_id: selectedLocation.province_id, // Gửi thêm để lưu DB nếu cần
			product_id: Number(productId),
		};

		const response = await fetch(API_CALCULATE_FEE, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const result = await response.json();
		if (response) {
			// 1. Cập nhật hiển thị phí ship
			window.shipFee = result.fee; // Lưu vào biến toàn cục để dùng khi bấm Thanh toán
			costShipEl.innerText = formatMoney(result.fee);

			// 2. Cập nhật ngày dự kiến
			if (result.expected_delivery_time) {
				const date = new Date(result.expected_delivery_time);
				expectedDateEl.innerText = date.toLocaleDateString("vi-VN");
			}

			// 3. Cập nhật Tổng tiền
			updateTotal(window.shipFee); // Hàm này đã có trong file gốc của bạn
		} else {
			costShipEl.innerText = "Không hỗ trợ";
			alert("Lỗi tính phí: " + result.message);
		}
	} catch (error) {
		console.error(error);
		costShipEl.innerText = "Lỗi";
	}
}

// --- CÁC HÀM TIỆN ÍCH ---

// Hàm reset select về trạng thái mặc định
function resetSelect(element, defaultText) {
	element.innerHTML = `<option value="">${defaultText}</option>`;
	element.disabled = false; // Mở khóa nếu đang bị disable
}

// Hàm đổ dữ liệu vào select
function populateSelect(element, items, valueKey, textKey) {
	if (!items || items.length === 0) return;

	// Sắp xếp theo tên cho dễ tìm (Tùy chọn)
	// items.sort((a, b) => a[textKey].localeCompare(b[textKey]));

	items.forEach((item) => {
		const option = document.createElement("option");
		option.value = item[valueKey];
		option.text = item[textKey];
		element.appendChild(option);
	});
}
