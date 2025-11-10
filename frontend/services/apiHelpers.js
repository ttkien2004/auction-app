export const BASE_URL = "http://localhost:3000/api";

/**
 * Hàm helper để lấy cấu hình headers (bao gồm token)
 * @param {object} customHeaders - Headers tùy chỉnh như 'Content-Type'
 * @returns {object} - Headers object
 */
export const getFetchHeaders = (customHeaders = {}) => {
	const headers = {
		...customHeaders,
	};

	const token = localStorage.getItem("token");
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	return headers;
};

/**
 * Hàm helper xử lý phản hồi (response) từ fetch
 * @param {Response} response - Đối tượng Response từ fetch
 */
export const handleResponse = async (response) => {
	// Nếu response không OK (ví dụ: 401, 404, 500)
	if (!response.ok) {
		let errorData;
		try {
			// Cố gắng đọc body của lỗi (thường là JSON)
			errorData = await response.json();
		} catch (e) {
			// Nếu body không phải JSON, dùng status text
			errorData = { message: response.statusText };
		}
		console.error("API Error Response:", errorData);
		throw errorData; // Ném lỗi để .catch() bên ngoài bắt được
	}

	// Nếu response OK (200-299)
	try {
		// Trả về dữ liệu JSON
		return await response.json();
	} catch (e) {
		// Xử lý trường hợp response 204 No Content (không có body)
		if (response.status === 204) {
			return { message: "Success (No Content)" };
		}
		// Trả về response rỗng nếu không parse được
		return {};
	}
};

/**
 * Hàm helper xử lý lỗi (khi request thất bại hoàn toàn, ví dụ: mất mạng)
 * @param {Error} err - The error object
 */
export const handleError = (err) => {
	console.error("Fetch Call Error:", err.message);
	// Ném lỗi để hàm gọi bên ngoài bắt được
	throw err;
};
