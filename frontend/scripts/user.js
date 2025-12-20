// TODO: Dùng file này cho việc gọi đến các Api services
import { R2_PUBLIC_URL, BASE_URL } from "../services/apiHelpers.js";
import userApi from "../services/userApi.js";

const provinceSelect = document.getElementById("province-select");
const districtSelect = document.getElementById("district-select");
const wardSelect = document.getElementById("ward-select");
const addressInput = document.getElementById("detail-address");
const emailInput = document.getElementById("email-input");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const phoneInput = document.getElementById("phone-input");
const API_LOCATION_URL = `${BASE_URL}/shipping/location`;

document.addEventListener("DOMContentLoaded", async () => {
	const profileForm = document.getElementById("user-profile-form");

	if (profileForm) {
		profileForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!provinceSelect.value || !districtSelect.value || !wardSelect.value) {
				alert("Bạn chưa điền thông tin địa chỉ!");
				return;
			}
			const updateData = {
				name: usernameInput.value,
				email: emailInput.value,
				password: passwordInput.value,
				phone_number: phoneInput.value,
				ghn_province_id: provinceSelect.value,
				ghn_district_id: districtSelect.value,
				ghn_ward_code: wardSelect.value,
				address: addressInput.value,
			};
			try {
				const updatedUser = await userApi.updateUser(updateData);
				alert("Updated user profile successfully!");
				emailInput.value = updatedUser.email;
				usernameInput.value = updatedUser.username;
				phoneInput.innerHTML = updatedUser.phone_number;
				provinceSelect.value = updatedUser.ghn_province_id;
				districtSelect.value = updatedUser.ghn_province_id;
				wardSelect.value = updatedUser.ghn_province_id;
				addressInput.value = updatedUser.address;
			} catch (error) {
				console.error("Lỗi khi cập nhật thông tin người dùng:", error);
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const user = await userApi.getUserProfile();
		// localStorage.setItem("userProfile", JSON.stringify(user));
		const userProfile = user.profile;
		// console.log("User profile:", profile);
		document.getElementById("username-input").value =
			userProfile.username || "";
		document.getElementById("email-input").value = userProfile.email || "";
		document.getElementById("phone-input").value =
			userProfile.phone_number || "";
		document.getElementById("user-avatar").src =
			R2_PUBLIC_URL + (userProfile.avatar || "");

		addressInput.value = userProfile.address;
		await initAddressDropdowns(userProfile);
	} catch (error) {
		console.error("Lỗi khi lấy thông tin người dùng:", error);
	}
});

// Hàm khởi tạo dropdown
async function initAddressDropdowns(user) {
	// Load Tỉnh
	await loadProvinces();
	if (user.ghn_province_id) {
		provinceSelect.value = user.ghn_province_id;

		// Load Huyện
		await loadDistricts(user.ghn_province_id);
		if (user.ghn_district_id) {
			districtSelect.value = user.ghn_district_id;

			// Load Xã
			await loadWards(user.ghn_district_id);
			if (user.ghn_ward_code) {
				wardSelect.value = user.ghn_ward_code;
			}
		}
	}

	// Gắn sự kiện change (Giống hệt trang order-confirmation)
	provinceSelect.addEventListener("change", (e) =>
		loadDistricts(e.target.value)
	);
	districtSelect.addEventListener("change", (e) => loadWards(e.target.value));
}

// Các hàm gọi liệt kê province/district/ward
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
