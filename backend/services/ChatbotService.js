const { GoogleGenerativeAI } = require("@google/generative-ai");
const ProductService = require("./ProductService"); // Để bot biết thông tin sản phẩm

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Hàm xử lý tin nhắn và sinh câu trả lời
 * @param {string} userMessage - Tin nhắn người dùng
 * @param {object} contextData - Dữ liệu ngữ cảnh (ví dụ: thông tin sản phẩm đang xem)
 */
const generateReply = async (userMessage, contextData = null) => {
	try {
		let prompt = `Bạn là trợ lý ảo của sàn đấu giá. Hãy trả lời ngắn gọn, thân thiện. `;

		if (contextData) {
			prompt += `Khách đang hỏi về sản phẩm: ${contextData.name}, Giá: ${contextData.price}. Tình trạng: ${contextData.condition}. `;
		}

		prompt += `Khách hỏi: "${userMessage}"`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	} catch (error) {
		console.error("Gemini Error:", error);
		return "Xin lỗi, tôi đang gặp chút trục trặc. Bạn vui lòng liên hệ admin nhé!";
	}
};

module.exports = { generateReply };
