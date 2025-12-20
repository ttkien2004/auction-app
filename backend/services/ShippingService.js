require("dotenv").config();

const GHN_TOKEN = process.env.GHN_API_TOKEN;
const GHN_SHOP_ID = parseInt(process.env.GHN_SHOP_ID); // ShopID phải là số
const BASE_URL = process.env.GHN_BASE_URL;
const axios = require("axios");

const getHeaders = () => ({
	headers: {
		token: GHN_TOKEN,
		"Content-Type": "application/json",
		ShopId: GHN_SHOP_ID,
	},
});

/**
 * 1. Lấy danh sách Tỉnh/Thành phố
 */
const getProvinces = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/master-data/province`, {
			headers: { token: GHN_TOKEN }, // API này chỉ cần token
		});
		return response.data.data;
	} catch (error) {
		throw new Error(
			"Lỗi lấy danh sách tỉnh: " +
				(error.response?.data?.message || error.message)
		);
	}
};

/**
 * 2. Lấy danh sách Quận/Huyện theo Tỉnh
 * @param {number} provinceId
 */
const getDistricts = async (provinceId) => {
	try {
		const response = await axios.get(`${BASE_URL}/master-data/district`, {
			headers: { token: GHN_TOKEN },
			params: { province_id: provinceId },
		});
		return response.data.data;
	} catch (error) {
		throw new Error(
			"Lỗi lấy danh sách quận: " +
				(error.response?.data?.message || error.message)
		);
	}
};

/**
 * 3. Lấy danh sách Phường/Xã theo Quận
 * @param {number} districtId
 */
const getWards = async (districtId) => {
	try {
		const response = await axios.get(`${BASE_URL}/master-data/ward`, {
			headers: { token: GHN_TOKEN },
			params: { district_id: districtId },
		});
		return response.data.data;
	} catch (error) {
		throw new Error(
			"Lỗi lấy danh sách phường: " +
				(error.response?.data?.message || error.message)
		);
	}
};

/**
 * 4. Lấy các gói dịch vụ vận chuyển khả dụng (Chuẩn, Nhanh...)
 * @param {number} fromDistrict - Quận người bán
 * @param {number} toDistrict - Quận người mua
 */
const getAvailableServices = async (fromDistrict, toDistrict) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/v2/shipping-order/available-services`,
			{
				shop_id: GHN_SHOP_ID,
				from_district: fromDistrict,
				to_district: toDistrict,
			},
			getHeaders()
		);
		return response.data.data;
	} catch (error) {
		throw new Error(
			"Lỗi lấy dịch vụ vận chuyển: " +
				(error.response?.data?.message || error.message)
		);
	}
};

/**
 * 5. TÍNH PHÍ VẬN CHUYỂN (API CHÍNH)
 * @param {object} shippingData
 */
const calculateFee = async (shippingData) => {
	const {
		service_id,
		insurance_value,
		from_district_id,
		to_district_id,
		to_ward_code,
		height,
		length,
		weight,
		width,
	} = shippingData;

	try {
		const response = await axios.post(
			`${BASE_URL}/v2/shipping-order/fee`,
			{
				service_id: service_id,
				insurance_value: insurance_value || 0, // Giá trị đơn hàng (để tính bảo hiểm)
				coupon: null,
				from_district_id: from_district_id,
				to_district_id: to_district_id,
				to_ward_code: to_ward_code,
				height: height || 10, // Mặc định kích thước nếu không có
				length: length || 10,
				weight: weight || 200, // Đơn vị gram
				width: width || 10,
			},
			getHeaders()
		);
		return response.data.data;
	} catch (error) {
		throw new Error(
			"Lỗi tính phí vận chuyển: " +
				(error.response?.data?.message || error.message)
		);
	}
};

// Tính toán TG giao hàng dự kiến
const calculateExpectedDelivery = async (
	fromDistrictId,
	toDistrictId,
	toWardCode
) => {
	try {
		const response = await axios.post(
			`${process.env.GHN_BASE_URL}/v2/shipping-order/leadtime`,
			{
				from_district_id: fromDistrictId,
				to_district_id: toDistrictId,
				to_ward_code: toWardCode,
				service_id: 53320, // 53320 là gói "Chuẩn" (Standard) của GHN
			},
			{
				headers: {
					token: process.env.GHN_API_TOKEN,
					ShopId: process.env.GHN_SHOP_ID,
					"Content-Type": "application/json",
				},
			}
		);

		// GHN trả về 'leadtime' là Unix Timestamp (giây)
		const leadtimeTimestamp = response.data.data.leadtime;

		// Chuyển đổi sang đối tượng Date của JS
		if (leadtimeTimestamp && leadtimeTimestamp > 0) {
			return new Date(leadtimeTimestamp * 1000);
		}
		throw new Error("GHN trả về leadtime không hợp lệ (0 hoặc null)");
		// return new Date(leadtimeTimestamp * 1000);
	} catch (error) {
		console.error(
			"Lỗi tính thời gian giao hàng:",
			error.response?.data || error.message
		);
		// Fallback: Nếu lỗi API, mặc định cộng thêm 5 ngày
		const defaultDate = new Date();
		defaultDate.setDate(defaultDate.getDate() + 5);
		return defaultDate;
	}
};

module.exports = {
	getProvinces,
	getDistricts,
	getWards,
	getAvailableServices,
	calculateFee,
	calculateExpectedDelivery,
};
