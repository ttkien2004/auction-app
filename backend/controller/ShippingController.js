// controllers/ShippingController.js
const ShippingService = require("../services/ShippingService");

// Lấy danh sách địa chính (Tỉnh/Huyện/Xã)
const getLocationData = async (req, res, next) => {
	try {
		const { type, parentId } = req.query; // type: 'province', 'district', 'ward'

		let data;
		if (type === "province") {
			data = await ShippingService.getProvinces();
		} else if (type === "district") {
			if (!parentId)
				return res.status(400).json({ message: "Thiếu province_id" });
			data = await ShippingService.getDistricts(Number(parentId));
		} else if (type === "ward") {
			if (!parentId)
				return res.status(400).json({ message: "Thiếu district_id" });
			data = await ShippingService.getWards(Number(parentId));
		} else {
			return res.status(400).json({ message: "Type không hợp lệ" });
		}

		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

// Tính phí vận chuyển
const calculateShippingFee = async (req, res, next) => {
	try {
		// Frontend gửi lên thông tin địa chỉ
		const { from_district_id, to_district_id, to_ward_code, insurance_value } =
			req.body;

		// 1. Lấy gói dịch vụ khả dụng trước (để lấy service_id)
		// (Thường chọn gói đầu tiên hoặc gói 'Chuẩn' làm mặc định)
		const services = await ShippingService.getAvailableServices(
			from_district_id,
			to_district_id
		);

		if (!services || services.length === 0) {
			return res
				.status(400)
				.json({
					message: "Không tìm thấy dịch vụ vận chuyển cho tuyến đường này",
				});
		}

		// Giả sử chọn gói dịch vụ đầu tiên (thường là gói chuẩn/rẻ nhất)
		const service_id = services[0].service_id;

		// 2. Gọi API tính phí
		const feeData = await ShippingService.calculateFee({
			service_id,
			insurance_value: parseInt(insurance_value),
			from_district_id: parseInt(from_district_id),
			to_district_id: parseInt(to_district_id),
			to_ward_code: to_ward_code, // Ward code là string
			// Các thông số kích thước có thể lấy từ Product DB hoặc mặc định
			height: 15,
			length: 15,
			width: 15,
			weight: 1000,
		});

		// Trả về kết quả bao gồm cả thông tin dịch vụ đã chọn
		res.status(200).json({
			fee: feeData.total, // Tổng phí
			service_name: services[0].short_name, // Tên gói (vd: Chuyển phát chuẩn)
			expected_delivery_time: feeData.expected_delivery_time, // GHN có trả về thời gian dự kiến
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getLocationData,
	calculateShippingFee,
};
